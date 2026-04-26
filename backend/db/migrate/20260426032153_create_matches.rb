class CreateMatches < ActiveRecord::Migration[8.1]
  def change
    create_table :matches do |t|
      t.references :home_team, null: false, foreign_key: { to_table: :teams }
      t.references :away_team, null: false, foreign_key: { to_table: :teams }
      t.references :sport, null: false, foreign_key: true
      t.references :venue, foreign_key: true
      t.references :booking, foreign_key: true
      t.datetime :scheduled_at
      t.string :status, default: 'scheduled'
      t.boolean :is_open, default: false
      t.string :commune

      t.timestamps
    end
  end
end
