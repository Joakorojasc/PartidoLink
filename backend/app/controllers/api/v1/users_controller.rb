module Api
  module V1
    class UsersController < BaseController
      skip_before_action :authenticate_user!, only: [:show]

      def show
        user = User.find(params[:id])
        render json: {
          id: user.id,
          name: user.name,
          bio: user.bio,
          avatar_url: user.avatar_url,
          teams: user.teams.includes(:sport).map { |t| { id: t.id, name: t.name, sport: { id: t.sport.id, name: t.sport.name, icon: t.sport.icon } } },
          sports: user.user_sports.includes(:sport).map { |us|
            { sport: { id: us.sport.id, name: us.sport.name, icon: us.sport.icon }, skill_level: us.skill_level }
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

      def add_sport
        user = User.find(params[:id])
        return render json: { error: "No autorizado" }, status: :forbidden unless user == current_user

        user_sport = UserSport.find_or_initialize_by(user: user, sport_id: params[:sport_id])
        user_sport.skill_level = params[:skill_level].presence || 'beginner'

        if user_sport.save
          render json: {
            sport: { id: user_sport.sport.id, name: user_sport.sport.name, icon: user_sport.sport.icon },
            skill_level: user_sport.skill_level
          }, status: :created
        else
          render json: { errors: user_sport.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def remove_sport
        user = User.find(params[:id])
        return render json: { error: "No autorizado" }, status: :forbidden unless user == current_user

        UserSport.where(user: user, sport_id: params[:sport_id]).destroy_all
        render json: { message: "Deporte eliminado" }
      end

      private

      def user_params
        params.require(:user).permit(:name, :phone, :bio, :avatar_url)
      end
    end
  end
end
