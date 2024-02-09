import { CanActivateFn } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';
import { Router } from '@angular/router';

export const candidateGuard: CanActivateFn = (route, state) => {
  return new Promise(async (resolve, reject) => {
    const router = new Router();
    // Check if user is authenticated --------------------------------------------------------------------------------
    // const { username, userId, signInDetails } = await getCurrentUser();
    // if (signInDetails) {
    //   resolve(true);
    // }else{
    //   router.navigateByUrl('/');
    //   resolve(false);
    // }
// console.log(accessToken);
// console.log(idToken);

    resolve(true);
  });
};
