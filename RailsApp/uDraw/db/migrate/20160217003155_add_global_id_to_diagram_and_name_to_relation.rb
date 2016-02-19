class AddGlobalIdToDiagramAndNameToRelation < ActiveRecord::Migration
  def change
    add_column :atributes, :x, :string
    add_column :atributes, :y, :string
    add_column :atributes, :class, :string
    add_column :relations, :name, :string
  end
end
