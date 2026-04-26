module Api
  module V1
    class BaseController < ApplicationController
      include Pundit::Authorization
      before_action :authenticate_user!

      rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
      rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

      private

      def user_not_authorized
        render json: { error: "No tienes permiso para realizar esta acción" }, status: :forbidden
      end

      def record_not_found(exception)
        render json: { error: "Recurso no encontrado" }, status: :not_found
      end
    end
  end
end
