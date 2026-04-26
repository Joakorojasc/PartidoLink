module Api
  module V1
    class MatchResultsController < BaseController
      def create
        match = Match.find(params[:match_id])
        result = match.match_results.new(result_params)
        result.submitted_by_team_id = params[:team_id] || current_user.teams.first&.id

        if result.save
          render json: result_json(result), status: :created
        else
          render json: { errors: result.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def accept
        result = MatchResult.find(params[:id])
        result.update(status: 'accepted')
        render json: { message: "Resultado aceptado" }
      end

      def reject
        result = MatchResult.find(params[:id])
        result.update(status: 'rejected')
        render json: { message: "Resultado rechazado" }
      end

      private

      def result_params
        params.require(:match_result).permit(:home_score, :away_score, :notes, :submitted_by_team_id)
      end

      def result_json(r)
        {
          id: r.id,
          home_score: r.home_score,
          away_score: r.away_score,
          status: r.status,
          is_validated: r.is_validated,
          suspicious: r.suspicious,
          notes: r.notes,
          submitted_by_team_id: r.submitted_by_team_id
        }
      end
    end
  end
end
