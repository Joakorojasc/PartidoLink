class CreateSports < ActiveRecord::Migration[8.1]
  def change
    create_table :sports do |t|
      t.string :name, null: false
      t.string :sport_type, null: false
      t.string :icon

      t.timestamps
    end
  end
end
