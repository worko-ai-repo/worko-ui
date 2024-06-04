import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


const API_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class PublicProfileService {

  /** 
  @param {HttpClient} http
  */
  constructor(private http : HttpClient , private authService: AuthService) { }
  
  getPublicServices(emailAddress:string): Promise<any> {
    return this.http.get(`${API_URL}user/${emailAddress}/pservice`,this.authService.getHttpOptions()).toPromise();
  }
}
