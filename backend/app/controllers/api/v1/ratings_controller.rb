module Api
  module V1
    class RatingsController < BaseController
      def create
        rating = Rating.new(rating_params)
        rating.rater = current_user

        if rating.save
          render json: {
            id: rating.id,
            score: rating.score,
            comment: rating.comment,
            rated_team_id: rating.rated_team_id
          }, status: :created
        else
          render json: { errors: rating.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def rating_params
        params.require(:rating).permit(:rated_team_id, :match_id, :score, :comment, :is_public)
      end
    end
  end
end
