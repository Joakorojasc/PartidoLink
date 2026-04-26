module Api
  module V1
    class MatchesController < BaseController
      skip_before_action :authenticate_user!, only: [:index, :show]

      def index
        matches = Match.includes(:sport, :home_team, :away_team, :venue).open.recent
        matches = matches.where(sport_id: params[:sport_id]) if params[:sport_id]
        matches = matches.where(commune: params[:commune]) if params[:commune]

        render json: matches.map { |m| match_json(m) }
      end

      def show
        match = Match.includes(:sport, :home_team, :away_team, :venue, :match_results).find(params[:id])
        results = match.match_results.map do |r|
          {
            id: r.id,
            home_score: r.home_score,
            away_score: r.away_score,
            status: r.status,
            is_validated: r.is_validated,
            suspicious: r.suspicious,
            submitted_by_team: { id: r.submitted_by_team_id }
          }
        end

        render json: match_json(match).merge(results: results)
      end

      def create
        match = Match.new(match_params)

        if match.save
          render json: match_json(match), status: :created
        else
          render json: { errors: match.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def challenge
        match = Match.find(params[:id])
        challenger_team_id = params[:team_id]

        unless challenger_team_id
          return render json: { error: "Debes especificar tu equipo" }, status: :unprocessable_entity
        end

        conversation = Conversation.create!(
          match: match,
          title: "Desafío: #{match.home_team.name} vs #{Team.find(challenger_team_id).name}",
          conversation_type: 'match'
        )
        ConversationParticipant.create!(conversation: conversation, team: match.home_team)
        ConversationParticipant.create!(conversation: conversation, team_id: challenger_team_id)

        render json: { conversation_id: conversation.id, message: "Desafío enviado exitosamente" }, status: :created
      end

      private

      def match_params
        params.require(:match).permit(:home_team_id, :away_team_id, :sport_id, :venue_id, :booking_id,
                                      :scheduled_at, :is_open, :commune)
      end

      def match_json(m)
        {
          id: m.id,
          scheduled_at: m.scheduled_at,
          status: m.status,
          is_open: m.is_open,
          commune: m.commune,
          sport: { id: m.sport.id, name: m.sport.name, icon: m.sport.icon },
          home_team: { id: m.home_team.id, name: m.home_team.name, avatar_url: m.home_team.avatar_url },
          away_team: { id: m.away_team.id, name: m.away_team.name, avatar_url: m.away_team.avatar_url },
          venue: m.venue ? { id: m.venue.id, name: m.venue.name, commune: m.venue.commune } : nil
        }
      end
    end
  end
end
