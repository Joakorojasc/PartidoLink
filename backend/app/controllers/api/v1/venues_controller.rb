module Api
  module V1
    class VenuesController < BaseController
      skip_before_action :authenticate_user!, only: [:index, :show]

      def index
        venues = Venue.includes(:sport).where(is_active: true)
        venues = venues.where(sport_id: params[:sport_id]) if params[:sport_id]
        venues = venues.where(commune: params[:commune]) if params[:commune]

        render json: venues.map { |v| venue_json(v) }
      end

      def show
        venue = Venue.includes(:sport).find(params[:id])
        render json: venue_json(venue)
      end

      private

      def venue_json(v)
        {
          id: v.id,
          name: v.name,
          address: v.address,
          commune: v.commune,
          city: v.city,
          price_per_hour: v.price_per_hour,
          price_formatted: format_clp(v.price_per_hour),
          description: v.description,
          image_url: v.image_url,
          phone: v.phone,
          website: v.website,
          sport: { id: v.sport.id, name: v.sport.name, icon: v.sport.icon }
        }
      end

      def format_clp(amount)
        return nil unless amount
        "$#{amount.to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1.').reverse}"
      end
    end
  end
end
