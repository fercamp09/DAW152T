class Diagram < ActiveRecord::Base
  has_many :diagrams_users, dependent: :destroy
  has_many :users, through: :diagrams_users
end
