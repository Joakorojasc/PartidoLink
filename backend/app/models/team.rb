class Team < ApplicationRecord
  belongs_to :sport
  belongs_to :captain, class_name: 'User'

  has_many :team_members, dependent: :destroy
  has_many :members, through: :team_members, source: :user

  has_many :home_matches, class_name: 'Match', foreign_key: :home_team_id, dependent: :destroy
  has_many :away_matches, class_name: 'Match', foreign_key: :away_team_id, dependent: :destroy
  has_many :submitted_results, class_name: 'MatchResult', foreign_key: :submitted_by_team_id, dependent: :destroy
  has_many :bookings, dependent: :destroy
  has_many :conversation_participants, dependent: :destroy
  has_many :conversations, through: :conversation_participants
  has_many :ratings_received, class_name: 'Rating', foreign_key: :rated_team_id, dependent: :destroy

  validates :name, presence: true
  validates :name, uniqueness: { scope: :sport_id, message: "ya existe un equipo con ese nombre en este deporte" }

  def matches
    Match.where("home_team_id = ? OR away_team_id = ?", id, id)
  end

  def validated_matches
    matches.where(status: 'played')
  end

  def rejection_count
    submitted_results.where(status: 'rejected').count
  end

  def record(sport_id = nil)
    scope = validated_matches
    scope = scope.where(sport_id: sport_id) if sport_id

    wins = 0
    draws = 0
    losses = 0

    scope.each do |match|
      result = match.match_results.find_by(is_validated: true)
      next unless result

      if match.home_team_id == id
        my_score = result.home_score
        opp_score = result.away_score
      else
        my_score = result.away_score
        opp_score = result.home_score
      end

      if my_score > opp_score
        wins += 1
      elsif my_score == opp_score
        draws += 1
      else
        losses += 1
      end
    end

    { wins: wins, draws: draws, losses: losses }
  end
end
