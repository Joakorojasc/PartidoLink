class Venue < ApplicationRecord
  belongs_to :sport

  has_many :bookings, dependent: :destroy
  has_many :matches, dependent: :nullify

  validates :name, presence: true
  validates :price_per_hour, numericality: { greater_than: 0 }, allow_nil: true
end
