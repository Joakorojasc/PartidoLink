module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json

        private

        def respond_with(resource, _opts = {})
          if resource.persisted?
            render json: {
              user: user_json(resource),
              message: "Cuenta creada exitosamente"
            }, status: :created
          else
            render json: {
              errors: resource.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        def sign_up_params
          params.require(:user).permit(:email, :password, :password_confirmation, :name, :rut, :phone, :bio)
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
