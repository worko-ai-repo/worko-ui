// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    resumeUploadLimit: 50,
    cognito: {
      userPoolId: 'ap-south-1_1f9O34ojY',
      userPoolWebClientId: '7ul99pqf5uflpl2ckvukklc6c3',
      domain: 'worko-congnito.auth.ap-south-1.amazoncognito.com'
    },
    baseUrl: 'https://worko.ai',
    jobBaseUrl: 'https://jobs.worko.ai/',
    razorpayKey:'REDACTED',
    // crossOriginUrl:'https://worko.ai',
    localUrl: 'https://worko.ai',
    apiUrl: "https://api.worko.ai/",
    chatApiUrl: 'https://chatapi.worko.ai/',
    chatWsUrl: 'wss://chatws.worko.ai',
    saveUserInfoApi:"https://w6zitv6ryk.execute-api.us-east-1.amazonaws.com/dev/adduserinfo",
    linkedInRedirection: "https://worko.ai/auth/checkRedirection",
    linkedInLogout: "https://worko.ai"
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
  