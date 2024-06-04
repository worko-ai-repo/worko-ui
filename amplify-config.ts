import { environment } from "src/environments/environment";

export const config = {

   'aws_project_region': 'ap-south-1',
   'aws_cognito_region': 'ap-south-1',
   'aws_user_pools_id': environment.cognito.userPoolId,
   'aws_user_pools_web_client_id': environment.cognito.userPoolWebClientId,
   "oauth": {
      "domain":  environment.cognito.domain,
      "redirectSignIn":
       environment.linkedInRedirection,
        // "http://localhost:4200/auth/checkRedirection",
      //  "https://worko.auth.ap-south-1.amazoncognito.com/oauth2/authorize?identity_provider=LinkedIn&redirect_uri=http://localhost:4200/auth/checkRedirection&response_type=CODE&client_id=5evf019rrkaijtnjf2j1vvdf33&state=h8HvXvQ2W4QvOE18H68wwcgWh3pIkANy&code_challenge=kI8A-NbOUiZw9Iv14YltZO5iTk6MTkK2Lu1PVAEsOyI&code_challenge_method=S256&scope=email%20openid%20phone",
      "redirectSignOut":
      environment.linkedInLogout,
         //"http://localhost:4200/auth/logout",
         // "http://localhost:4200/",
      "responseType": "code",
      "scope": [
         "email",
         "openid",
         "profile",
         "phone"
      ]
   },

     
};


//        'aws_cognito_identity_pool_id': 'us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',