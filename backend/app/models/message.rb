class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :sender, class_name: 'User'

  validates :content, presence: true

  after_create_commit :broadcast_message

  private

  def broadcast_message
    ActionCable.server.broadcast(
      "conversation_#{conversation_id}",
      {
        id: id,
        content: content,
        sender_id: sender_id,
        sender_name: sender.name,
        sender_avatar: sender.avatar_url,
        created_at: created_at
      }
    )
  end
end
