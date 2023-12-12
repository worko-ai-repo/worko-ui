import { CanActivateFn } from '@angular/router';
// import { getCurrentUser, fetchAuthSession  } from 'aws-amplify/auth';

export const candidateGuard: CanActivateFn = (route, state) => {
  return new Promise(async (resolve, reject) => {

    // Check if user is authenticated --------------------------------------------------------------------------------
//     const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
// console.log(accessToken);
// console.log(idToken);

    resolve(true);
  });
};
