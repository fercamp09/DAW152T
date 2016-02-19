class CreateDiagramTables < ActiveRecord::Migration
  def change
    create_table :entities do |t|
      t.string :height
      t.string :width
      t.string :y0
      t.string :x0
      t.string :title
      t.string :transform
      t.string :svg_id
      t.references :diagram, index: true, foreign_key: true

      t.timestamps null: false
    end
    create_table :relations do |t|
      t.string :arrow_start
      t.string :arrow_end
      t.string :class
      t.string :x1
      t.string :y1
      t.string :x2
      t.string :y2
      t.references :entity, index: true, foreign_key: true
      t.references :diagram, index: true, foreign_key: true

      t.timestamps null: false
    end
    create_table :atributes do |t|
      t.string :info
      t.references :entity, index: true, foreign_key: true

      t.timestamps null: false
    end
  end

end
