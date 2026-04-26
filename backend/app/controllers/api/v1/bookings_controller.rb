module Api
  module V1
    class BookingsController < BaseController
      def create
        booking = Booking.new(booking_params)
        booking.created_by = current_user

        if booking.save
          render json: booking_json(booking), status: :created
        else
          render json: { errors: booking.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def show
        booking = Booking.includes(:venue, :team, :created_by).find(params[:id])
        render json: booking_json(booking)
      end

      def cancel
        booking = Booking.find(params[:id])
        unless booking.created_by == current_user || booking.team.captain == current_user
          return render json: { error: "No tienes permiso para cancelar esta reserva" }, status: :forbidden
        end

        if booking.update(status: 'cancelled')
          render json: { message: "Reserva cancelada exitosamente" }
        else
          render json: { error: "No se pudo cancelar la reserva" }, status: :unprocessable_entity
        end
      end

      private

      def booking_params
        params.require(:booking).permit(:venue_id, :team_id, :date, :start_time, :end_time, :payment_mode, :notes)
      end

      def booking_json(b)
        {
          id: b.id,
          date: b.date,
          start_time: b.start_time,
          end_time: b.end_time,
          status: b.status,
          payment_mode: b.payment_mode,
          notes: b.notes,
          venue: { id: b.venue.id, name: b.venue.name, commune: b.venue.commune },
          team: { id: b.team.id, name: b.team.name }
        }
      end
    end
  end
end
