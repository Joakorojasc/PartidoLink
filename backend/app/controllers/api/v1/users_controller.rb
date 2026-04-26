module Api
  module V1
    class UsersController < BaseController
      def show
        user = User.find(params[:id])
        render json: {
          id: user.id,
          name: user.name,
          bio: user.bio,
          avatar_url: user.avatar_url,
          teams: user.teams.map { |t| { id: t.id, name: t.name, sport: t.sport.name } },
          sports: user.user_sports.includes(:sport).map { |us|
            { sport: { id: us.sport.id, name: us.sport.name }, skill_level: us.skill_level }
          }
        }
      end

      def update
        user = User.find(params[:id])
        unless user == current_user
          return render json: { error: "No puedes editar el perfil de otro usuario" }, status: :forbidden
        end

        if user.update(user_params)
          render json: { id: user.id, name: user.name, bio: user.bio, avatar_url: user.avatar_url, phone: user.phone }
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def sports
        user = User.find(params[:id])
        render json: user.user_sports.includes(:sport).map { |us|
          { sport: { id: us.sport.id, name: us.sport.name, icon: us.sport.icon }, skill_level: us.skill_level }
        }
      end

      private

      def user_params
        params.require(:user).permit(:name, :phone, :bio, :avatar_url)
      end
    end
  end
end
