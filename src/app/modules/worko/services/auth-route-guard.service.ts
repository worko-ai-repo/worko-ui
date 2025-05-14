import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRouteGuardService {
  constructor(public router: Router, private cognitoService: CognitoService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.cognitoService.getAccessToken()) {
      return true;
    } else {
      // Get current origin (e.g., https://dev-ui.worko.work)
      const origin = window.location.origin;
      // Redirect to /auth/login on the same domain
      window.location.href = `${origin}/auth/login`;
      return false;
    }
  }

}
