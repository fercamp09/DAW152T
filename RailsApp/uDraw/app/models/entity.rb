class Entity < ActiveRecord::Base
  has_many :relations, dependent: :destroy
  has_many :atributes, dependent: :destroy
end
