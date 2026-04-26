module Api
  module V1
    class TeamsController < BaseController
      skip_before_action :authenticate_user!, only: [:index, :show]

      def index
        teams = Team.includes(:sport, :captain)
        teams = teams.where(sport_id: params[:sport_id]) if params[:sport_id]
        teams = teams.where(commune: params[:commune]) if params[:commune]
        teams = teams.where(is_open: true) if params[:is_open] == 'true'

        render json: teams.map { |t| team_summary(t) }
      end

      def show
        team = Team.includes(:sport, :captain, :members).find(params[:id])
        rec = team.record
        render json: team_json(team, rec)
      end

      def create
        team = Team.new(team_params)
        team.captain = current_user

        if team.save
          TeamMember.create!(team: team, user: current_user, role: 'captain')
          render json: team_summary(team), status: :created
        else
          render json: { errors: team.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        team = Team.find(params[:id])
        unless team.captain == current_user
          return render json: { error: "Solo el capitán puede editar el equipo" }, status: :forbidden
        end

        if team.update(team_params)
          render json: team_summary(team)
        else
          render json: { errors: team.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def join
        team = Team.find(params[:id])
        member = TeamMember.new(team: team, user: current_user, role: 'member')

        if member.save
          render json: { message: "Te uniste al equipo #{team.name}" }
        else
          render json: { errors: member.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def matches
        team = Team.find(params[:id])
        scope = team.matches.includes(:sport, :home_team, :away_team, :match_results).recent

        case params[:filter]
        when 'validated'
          scope = scope.where(status: 'played')
        when 'disputed'
          scope = scope.where(status: 'disputed')
        end

        render json: scope.map { |m| match_summary(m) }
      end

      def stats
        team = Team.find(params[:id])
        render json: {
          overall: team.record,
          rejection_count: team.rejection_count,
          total_matches: team.matches.count,
          validated_matches: team.validated_matches.count
        }
      end

      private

      def team_params
        params.require(:team).permit(:name, :sport_id, :description, :avatar_url, :is_open, :commune)
      end

      def team_summary(team)
        {
          id: team.id,
          name: team.name,
          commune: team.commune,
          is_open: team.is_open,
          avatar_url: team.avatar_url,
          sport: { id: team.sport.id, name: team.sport.name, icon: team.sport.icon },
          captain: { id: team.captain.id, name: team.captain.name }
        }
      end

      def team_json(team, rec)
        team_summary(team).merge(
          description: team.description,
          members: team.members.map { |u| { id: u.id, name: u.name, avatar_url: u.avatar_url } },
          record: rec,
          rejection_count: team.rejection_count,
          average_rating: team.ratings_received.average(:score)&.round(1)
        )
      end

      def match_summary(m)
        {
          id: m.id,
          scheduled_at: m.scheduled_at,
          status: m.status,
          is_open: m.is_open,
          commune: m.commune,
          sport: { id: m.sport.id, name: m.sport.name },
          home_team: { id: m.home_team.id, name: m.home_team.name },
          away_team: m.away_team ? { id: m.away_team.id, name: m.away_team.name } : nil,
          results: m.match_results.map { |r|
            { home_score: r.home_score, away_score: r.away_score, is_validated: r.is_validated }
          }
        }
      end
    end
  end
end
