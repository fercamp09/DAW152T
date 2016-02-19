class Relation < ActiveRecord::Base
  belongs_to :diagram
  belongs_to :entity
end
