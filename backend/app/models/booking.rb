class Booking < ApplicationRecord
  belongs_to :venue
  belongs_to :team
  belongs_to :created_by, class_name: 'User'

  has_one :match, dependent: :nullify

  validates :date, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :status, inclusion: { in: %w[pending confirmed cancelled] }
  validates :payment_mode, inclusion: { in: %w[full split] }
  validate :end_after_start

  private

  def end_after_start
    return unless start_time && end_time
    errors.add(:end_time, "debe ser posterior a la hora de inicio") if end_time <= start_time
  end
end
