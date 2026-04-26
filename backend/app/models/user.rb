class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  validates :name, presence: true
  validates :rut, presence: true, uniqueness: true,
            format: { with: /\A\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}\z/,
                      message: "debe tener formato chileno (ej: 12.345.678-9)" }

  has_many :team_members, dependent: :destroy
  has_many :teams, through: :team_members
  has_many :captained_teams, class_name: 'Team', foreign_key: :captain_id, dependent: :nullify
  has_many :user_sports, dependent: :destroy
  has_many :sports, through: :user_sports
  has_many :sent_messages, class_name: 'Message', foreign_key: :sender_id, dependent: :destroy
  has_many :bookings, foreign_key: :created_by_id, dependent: :destroy
  has_many :ratings_given, class_name: 'Rating', foreign_key: :rater_id, dependent: :destroy
end
