require 'savon'
class SessionController < ApplicationController
  def new
  end

  def create
    #client = Savon.client(ssl_ca_cert_file: "C:/RailsInstaller/cacert.pem", wsdl: "https://ws.espol.edu.ec/saac/wsandroid.asmx?WSDL")
    client = Savon.client(ssl_verify_mode: :none, wsdl: "https://ws.espol.edu.ec/saac/wsandroid.asmx?WSDL")
    response = client.call(:autenticacion, message: { authUser: params[:session][:email], authContrasenia: params[:session][:password] })

    autenticado = response.body[:autenticacion_response][:autenticacion_result]

    if autenticado
      session[:user_id] = params[:session][:email]
      User.create({ name: session[:user_id], espol: session[:user_id] }) unless User.exists?(espol: session[:user_id])
      response = client.call(:ws_info_usuario, message: { authUser: params[:session][:email]})
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
