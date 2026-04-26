class Rating < ApplicationRecord
  belongs_to :rater, class_name: 'User'
  belongs_to :rated_team, class_name: 'Team'
  belongs_to :match, optional: true

  validates :score, presence: true, inclusion: { in: 1..5, message: "debe ser entre 1 y 5" }
end
