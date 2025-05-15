import { Injectable } from '@angular/core';
import { CognitoService } from '../../services/cognito.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '../../app-core/services/storage.service';
import { TorusGeometry } from 'three';


@Injectable({
  providedIn: 'root'
})

export class AuthCoporateGuardService {

  constructor(private cognitoService: CognitoService, private router: Router, private storage: StorageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const accessToken = this.cognitoService.getAccessToken();
    const userType = this.storage.get('userType');
    if ((accessToken) && (userType === 'Corporate')) {
      return true;
    } else {
      // Navigate to the corporate login page
      this.router.navigate(['/auth/corporate/login']);
      return false;
    }
  }
}