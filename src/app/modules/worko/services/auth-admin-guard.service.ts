import { Injectable } from '@angular/core';
import { CognitoService } from '../../services/cognito.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '../../app-core/services/storage.service';
import { TorusGeometry } from 'three';


@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuardService {

  constructor(private cognitoService: CognitoService, private router: Router, private storage: StorageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const accessToken = this.cognitoService.getAccessToken();
    const userType = this.storage.get('userType');
    if ((accessToken) && (userType === 'Admin')) {
      return true
    } else {
      // Get current origin (e.g., https://dev-ui.worko.work)
      const origin = window.location.origin;
      // Redirect to /auth/login on the same domain
      window.location.href = `${origin}/auth/login`;
      return false;
    }
  }
}
