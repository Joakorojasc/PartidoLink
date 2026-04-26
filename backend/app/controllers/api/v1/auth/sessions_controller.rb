module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json

        private

        def respond_with(resource, _opts = {})
          render json: {
            user: user_json(resource),
            token: request.env['warden-jwt_auth.token']
          }, status: :ok
        end

        def respond_to_on_destroy
          render json: { message: "Sesión cerrada exitosamente" }, status: :ok
        end

        def user_json(user)
          {
            id: user.id,
            email: user.email,
            name: user.name,
            rut: user.rut,
            phone: user.phone,
            bio: user.bio,
            avatar_url: user.avatar_url
          }
        end
      end
    end
  end
end
