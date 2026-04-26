class CreateVenues < ActiveRecord::Migration[8.1]
  def change
    create_table :venues do |t|
      t.string :name, null: false
      t.string :address
      t.string :commune
      t.string :city, default: 'Santiago'
      t.references :sport, null: false, foreign_key: true
      t.integer :price_per_hour
      t.text :description
      t.string :image_url
      t.string :phone
      t.string :website
      t.boolean :is_active, default: true

      t.timestamps
    end
  end
end
