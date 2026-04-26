class CreateUserSports < ActiveRecord::Migration[8.1]
  def change
    create_table :user_sports do |t|
      t.references :user, null: false, foreign_key: true
      t.references :sport, null: false, foreign_key: true
      t.string :skill_level, default: 'beginner'

      t.timestamps
    end

    add_index :user_sports, [ :user_id, :sport_id ], unique: true
  end
end
