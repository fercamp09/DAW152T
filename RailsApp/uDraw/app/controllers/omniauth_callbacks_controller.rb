class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def self.provides_callback_for(provider)
    class_eval %Q{
      def #{provider}
        @user = User.find_for_oauth(env["omniauth.auth"], current_user)

        if @user.persisted?
          sign_in_and_redirect @user, event: :authentication
          set_flash_message(:notice, :success, kind: #{provider}.capitalize) if is_navigational_format?
        else
          session["devise.#{provider}_data"] = env["omniauth.auth"].except("extra")
          redirect_to window_path
        end
      end
    }
  end

  [:twitter, :facebook, :google].each do |provider|
    provides_callback_for provider
  end

end