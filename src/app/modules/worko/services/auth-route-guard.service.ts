import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRouteGuardService {
  constructor( public router:Router,private cognitoService:CognitoService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

    if(this.cognitoService.getAccessToken()){
      return true;
    }else{
      this.router.navigate(['/']);
    }
    return false; 
}
  
}
