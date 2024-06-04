// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//     production: false,
//     cognito: {
//       userPoolId: 'ap-south-1_tAj7HAKZh',
//       userPoolWebClientId: '5evf019rrkaijtnjf2j1vvdf33',
//     },
//     crossOriginUrl:'https://dev.worko.work',
//     localUrl: 'https://app.dev.worko.work',
//     apiUrl: "https://api.worko.ai/",
//     saveUserInfoApi:"https://w6zitv6ryk.execute-api.us-east-1.amazonaws.com/dev/adduserinfo",
//     linkedInRedirection: "https://app.worko.ai/auth/checkRedirection",
//     linkedInLogout: "https://app.dev.worko.work"
//   };

export const environment = {
    production: false,
    cognito: {
      userPoolId: 'ap-south-1_xGreJKkNc',
      userPoolWebClientId: '16sh5s2bo3169886fdm8gtp0e4',
      domain:'https://worko-dev.auth.ap-south-1.amazoncognito.com'
    },
    crossOriginUrl:'https://dev.worko.work',
    localUrl: 'https://app.dev.worko.work',
    apiUrl: "https://api.dev.worko.work/",
    // apiUrl: "https://api.worko.ai/",
    saveUserInfoApi:"https://w6zitv6ryk.execute-api.us-east-1.amazonaws.com/dev/adduserinfo",
    linkedInRedirection:  window.location.origin + "/auth/checkRedirection",
    linkedInLogout:  window.location.origin+"/auth/logout"
  };
  
    
  // This file can be replaced during build by using the `fileReplacements` array.
  // `ng build` replaces `environment.ts` with `environment.prod.ts`.
  // The list of file replacements can be found in `angular.json`.
  // 
  // export const environment = {
  //   production: false,
  //   cognito: {
  //     userPoolId: 'ap-south-1_tAj7HAKZh',
  //     userPoolWebClientId: '5evf019rrkaijtnjf2j1vvdf33',
  //   },
  //   crossOriginUrl:'http://localhost:4300',
  //   localUrl: 'http://localhost:4200',
  //   apiUrl: "https://api.worko.ai/",
  //   saveUserInfoApi:"https://w6zitv6ryk.execute-api.us-east-1.amazonaws.com/dev/adduserinfo",
  //   // createOrderUrl:"https://seqaxy10nl.execute-api.ap-south-1.amazonaws.com/dev/user/63b0e8d0-c94d-492a-9f20-02b24f0bf081/",
  //   linkedInRedirection: 
  //   window.location.origin + "/auth/checkRedirection",
  // //"http://localhost:4200/auth/checkRedirection",
  //   linkedInLogout: 
  //   window.location.origin+"/auth/logout"
  //   //"http://localhost:4200"
  // };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
  
    
    /*
     * For easier debugging in development mode, you can import the following file
     * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
     *
     * This import should be commented out in production mode because it will have a negative impact
     * on performance if an error is thrown.
     */
    // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
    