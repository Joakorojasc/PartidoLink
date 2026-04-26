class ApplicationController < ActionController::API
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :rut, :phone, :bio])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :rut, :phone, :bio, :avatar_url])
  end
end
