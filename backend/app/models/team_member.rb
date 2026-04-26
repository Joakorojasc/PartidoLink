class TeamMember < ApplicationRecord
  belongs_to :team
  belongs_to :user

  validates :role, inclusion: { in: %w[captain member] }
  validates :user_id, uniqueness: { scope: :team_id, message: "ya es miembro de este equipo" }
end
