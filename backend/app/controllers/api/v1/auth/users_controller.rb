module Api
  module V1
    module Auth
      class UsersController < Api::V1::BaseController
        def me
          render json: user_json(current_user)
        end

        private

        def user_json(user)
          {
            id: user.id,
            email: user.email,
            name: user.name,
            rut: user.rut,
            phone: user.phone,
            bio: user.bio,
            avatar_url: user.avatar_url,
            teams: user.teams.includes(:sport).map { |t| { id: t.id, name: t.name, sport: { id: t.sport.id, name: t.sport.name, icon: t.sport.icon } } },
            sports: user.user_sports.includes(:sport).map { |us|
              { sport: { id: us.sport.id, name: us.sport.name }, skill_level: us.skill_level }
            }
          }
        end
      end
    end
  end
end
