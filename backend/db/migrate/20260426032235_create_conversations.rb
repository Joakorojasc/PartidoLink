class CreateConversations < ActiveRecord::Migration[8.1]
  def change
    create_table :conversations do |t|
      t.references :match, foreign_key: true
      t.string :title
      t.string :conversation_type, default: 'direct'

      t.timestamps
    end
  end
end
