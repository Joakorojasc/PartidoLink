module Api
  module V1
    class ConversationsController < BaseController
      def index
        team_ids = current_user.teams.pluck(:id)
        conversations = Conversation
          .joins(:conversation_participants)
          .where(conversation_participants: { team_id: team_ids })
          .includes(:teams, :messages)
          .distinct

        render json: conversations.map { |c| conversation_json(c) }
      end

      def create
        conversation = Conversation.new(conversation_params)

        if conversation.save
          Array(params[:team_ids]).each do |team_id|
            ConversationParticipant.create!(conversation: conversation, team_id: team_id)
          end
          render json: conversation_json(conversation), status: :created
        else
          render json: { errors: conversation.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def conversation_params
        params.require(:conversation).permit(:match_id, :title, :conversation_type)
      end

      def conversation_json(c)
        last_message = c.messages.order(created_at: :desc).first
        {
          id: c.id,
          title: c.title,
          conversation_type: c.conversation_type,
          teams: c.teams.map { |t| { id: t.id, name: t.name } },
          last_message: last_message ? { content: last_message.content, created_at: last_message.created_at } : nil,
          message_count: c.messages.count
        }
      end
    end
  end
end
