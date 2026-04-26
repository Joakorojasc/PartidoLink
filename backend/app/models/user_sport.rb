class UserSport < ApplicationRecord
  belongs_to :user
  belongs_to :sport

  validates :skill_level, inclusion: { in: %w[beginner intermediate advanced pro] }
  validates :user_id, uniqueness: { scope: :sport_id, message: "ya tiene este deporte registrado" }
end
