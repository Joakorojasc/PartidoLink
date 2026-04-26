module Api
  module V1
    class MessagesController < BaseController
      def index
        conversation = Conversation.find(params[:conversation_id])
        messages = conversation.messages.includes(:sender).order(:created_at)
        render json: messages.map { |m| message_json(m) }
      end

      def create
        conversation = Conversation.find(params[:conversation_id])
        message = conversation.messages.new(content: params.dig(:message, :content))
        message.sender = current_user

        if message.save
          render json: message_json(message), status: :created
        else
          render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def message_json(m)
        {
          id: m.id,
          content: m.content,
          read_at: m.read_at,
          created_at: m.created_at,
          sender: { id: m.sender.id, name: m.sender.name, avatar_url: m.sender.avatar_url }
        }
      end
    end
  end
end
