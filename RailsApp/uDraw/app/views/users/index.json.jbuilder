json.array!(@users) do |user|
  json.extract! user, :id, :edit
  json.url user_url(user, format: :json)
end
