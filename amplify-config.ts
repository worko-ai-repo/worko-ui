export const config =  {
     
        'aws_project_region': 'ap-south-1',
        'aws_cognito_region': 'ap-south-1',
        'aws_user_pools_id': 'ap-south-1_tAj7HAKZh',
        'aws_user_pools_web_client_id': '5evf019rrkaijtnjf2j1vvdf33',

        "oauth":{
                "domain":"worko.auth.ap-south-1.amazoncognito.com",
                "redirectSignIn":
                "http://localhost:4200/auth/checkRedirection",
               //  "https://worko.auth.ap-south-1.amazoncognito.com/oauth2/authorize?identity_provider=LinkedIn&redirect_uri=http://localhost:4200/auth/checkRedirection&response_type=CODE&client_id=5evf019rrkaijtnjf2j1vvdf33&state=h8HvXvQ2W4QvOE18H68wwcgWh3pIkANy&code_challenge=kI8A-NbOUiZw9Iv14YltZO5iTk6MTkK2Lu1PVAEsOyI&code_challenge_method=S256&scope=email%20openid%20phone",
                "redirectSignOut":"http://localhost:4200/auth/logout",
                "responseType":"code",
                "scope":[
                   "email",
                   "openid",
                   "profile",
                   "phone"
                ]
             }
       };
       
       
//        'aws_cognito_identity_pool_id': 'us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',