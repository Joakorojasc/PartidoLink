class Conversation < ApplicationRecord
  belongs_to :match, optional: true

  has_many :conversation_participants, dependent: :destroy
  has_many :teams, through: :conversation_participants
  has_many :messages, dependent: :destroy

  validates :conversation_type, inclusion: { in: %w[match direct team] }
end
