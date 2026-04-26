class CreateMatchResults < ActiveRecord::Migration[8.1]
  def change
    create_table :match_results do |t|
      t.references :match, null: false, foreign_key: true
      t.references :submitted_by_team, null: false, foreign_key: { to_table: :teams }
      t.integer :home_score, null: false
      t.integer :away_score, null: false
      t.string :status, default: 'pending'
      t.boolean :is_validated, default: false
      t.boolean :suspicious, default: false
      t.text :notes

      t.timestamps
    end

    add_index :match_results, [ :match_id, :submitted_by_team_id ], unique: true
  end
end
