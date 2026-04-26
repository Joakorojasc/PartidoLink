class CreateBookings < ActiveRecord::Migration[8.1]
  def change
    create_table :bookings do |t|
      t.references :venue, null: false, foreign_key: true
      t.references :team, null: false, foreign_key: true
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.date :date, null: false
      t.time :start_time, null: false
      t.time :end_time, null: false
      t.string :status, default: 'pending'
      t.string :payment_mode, default: 'full'
      t.text :notes

      t.timestamps
    end
  end
end
