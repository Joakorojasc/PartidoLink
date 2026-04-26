class CreateTeams < ActiveRecord::Migration[8.1]
  def change
    create_table :teams do |t|
      t.string :name, null: false
      t.references :sport, null: false, foreign_key: true
      t.references :captain, null: false, foreign_key: { to_table: :users }
      t.text :description
      t.string :avatar_url
      t.boolean :is_open, default: true
      t.string :commune

      t.timestamps
    end
  end
end
