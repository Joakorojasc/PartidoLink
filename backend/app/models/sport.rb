class Sport < ApplicationRecord
  validates :name, presence: true
  validates :sport_type, presence: true, inclusion: { in: %w[team individual] }

  has_many :user_sports, dependent: :destroy
  has_many :users, through: :user_sports
  has_many :teams, dependent: :destroy
  has_many :venues, dependent: :destroy
  has_many :matches, dependent: :destroy
end
