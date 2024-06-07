import { environment } from "src/environments/environment";

export const config = {

   'aws_project_region': 'ap-south-1',
   'aws_cognito_region': 'ap-south-1',
   'aws_user_pools_id': environment.cognito.userPoolId,
   'aws_user_pools_web_client_id': environment.cognito.userPoolWebClientId,
   "oauth": {
      "domain":  environment.cognito.domain,
      "redirectSignIn": environment.linkedInRedirection,
      "redirectSignOut":environment.linkedInLogout,
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