class MatchResult < ApplicationRecord
  belongs_to :match
  belongs_to :submitted_by_team, class_name: 'Team'

  validates :home_score, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :away_score, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :status, inclusion: { in: %w[pending accepted rejected] }
  validates :submitted_by_team_id, uniqueness: { scope: :match_id, message: "este equipo ya envió un resultado para este partido" }

  before_save :flag_suspicious_scores
  after_save :check_and_validate_results

  private

  def flag_suspicious_scores
    self.suspicious = home_score > 25 || away_score > 25
    true
  end

  def check_and_validate_results
    return unless saved_change_to_home_score? || saved_change_to_away_score? || id_previously_changed?

    results = match.match_results.reload
    return unless results.count == 2

    r1, r2 = results
    if r1.home_score == r2.home_score && r1.away_score == r2.away_score
      results.each { |r| r.update_columns(is_validated: true, status: 'accepted') }
      match.update_columns(status: 'played')
    else
      match.update_columns(status: 'disputed')
    end
  end
end
