class Api::V1::ConfigsController < ApplicationController

  def show
    render json: [
      {
        'GIFT_REQUEST_COIN_STEP': ENV['GIFT_REQUEST_COIN_STEP']
      }
    ]
  end
end
