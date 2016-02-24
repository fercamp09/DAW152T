class Comment < ActiveRecord::Base
  belongs_to :diagram
  validates :body, presence: true, length: {maximum: 2000}
end
