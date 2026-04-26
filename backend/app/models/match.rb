class Match < ApplicationRecord
  belongs_to :home_team, class_name: 'Team'
  belongs_to :away_team, class_name: 'Team', optional: true
  belongs_to :sport
  belongs_to :venue, optional: true
  belongs_to :booking, optional: true

  has_many :match_results, dependent: :destroy
  has_many :conversations, dependent: :destroy
  has_many :ratings, dependent: :destroy

  validates :status, inclusion: { in: %w[scheduled played cancelled disputed] }

  scope :open, -> { where(is_open: true, status: 'scheduled') }
  scope :recent, -> { order(scheduled_at: :desc) }
end
