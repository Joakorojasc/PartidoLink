class CreateRatings < ActiveRecord::Migration[8.1]
  def change
    create_table :ratings do |t|
      t.references :rater, null: false, foreign_key: { to_table: :users }
      t.references :rated_team, null: false, foreign_key: { to_table: :teams }
      t.references :match, foreign_key: true
      t.integer :score, null: false
      t.text :comment
      t.boolean :is_public, default: true

      t.timestamps
    end
  end
end
