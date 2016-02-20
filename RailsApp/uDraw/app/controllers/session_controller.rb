require 'savon'
class SessionController < ApplicationController
  before_action :require_admin, only: [:index]
  def new
  end

  def create
    #client = Savon.client(ssl_ca_cert_file: "C:/RailsInstaller/cacert.pem", wsdl: "https://ws.espol.edu.ec/saac/wsandroid.asmx?WSDL")
    #client = Savon.client(ssl_verify_mode: :none, wsdl: "https://ws.espol.edu.ec/saac/wsandroid.asmx?WSDL")
    #response = client.call(:autenticacion, message: { authUser: params[:session][:email], authContrasenia: params[:session][:password] })

    #autenticado = response.body[:autenticacion_response][:autenticacion_result]
    autenticado = true

    if autenticado
      espol_id = params[:session][:email]
      User.create({ name: espol_id, espol: espol_id }) unless User.exists?(espol: espol_id )
      user = User.find_by(espol: espol_id)
      session[:user_id] = user.id
      #response = client.call(:ws_info_usuario, message: { authUser: params[:session][:email]})
      redirect_to '/window'
    else
      redirect_to '/login'
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to '/'
  end

  private
  def user_params
    params.require(:user).permit(:email, :password)
  end
end
