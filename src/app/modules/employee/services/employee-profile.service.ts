import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../worko/services/auth.service';


const API_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {

 /** 
  @param {HttpClient} http
  */
  constructor(private http : HttpClient , private authService: AuthService) { }

  getBankDetails(emailAddress:string): Promise<any> {
    return this.http.get(`${API_URL}user/${emailAddress}/bankDetail`,this.authService.getHttpOptions()).toPromise();
  }

  createBankDetails(emailAddress:string, data: any): Promise<any> {
    return this.http.post(`${API_URL}user/${emailAddress}/bankDetail`,data,this.authService.getHttpOptions()).toPromise();
  }

  getEmployeeReferral(emailAddress:string, companySK: string): Promise<any> {
    return this.http.get(`${API_URL}referral/company/${companySK}`,this.authService.getHttpOptions()).toPromise();
  }

}
