class Api::V1::User::BaseController
  SECRET_KEY = ENV["SECRET"]
  def current_user
        #これをRialsで
        #let jwt_secret = get_secret()?;
        #let token_data = decode::<Claims>(
        #    bearer.token(), 
        #    &DecodingKey::from_secret(jwt_secret.as_ref()),
        #    &Validation::default()
  end
end
