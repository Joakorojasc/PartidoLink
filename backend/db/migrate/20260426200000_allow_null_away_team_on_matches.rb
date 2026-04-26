class AllowNullAwayTeamOnMatches < ActiveRecord::Migration[8.1]
  def change
    change_column_null :matches, :away_team_id, true
  end
end
