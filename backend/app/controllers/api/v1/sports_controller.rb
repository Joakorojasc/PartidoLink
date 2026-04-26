module Api
  module V1
    class SportsController < BaseController
      skip_before_action :authenticate_user!, only: [:index]

      def index
        sports = Sport.all.order(:name)
        render json: sports.map { |s| { id: s.id, name: s.name, sport_type: s.sport_type, icon: s.icon } }
      end
    end
  end
end
