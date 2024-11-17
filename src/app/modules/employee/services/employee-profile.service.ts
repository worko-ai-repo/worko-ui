import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
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

  async getEmployeeReferral(emailAddress:string, companyId: string, status: string, lastKey?: string): Promise<any> {

    let url = `${API_URL}emp/referral/${emailAddress}/?companyId=${companyId}&status=${status}`;
    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }

    try {
      return await this.http.get(url, this.authService.getHttpOptions()).toPromise();
    } catch (error) {
      console.error('Error fetching referral list:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
    // return this.http.get(`${API_URL}emp/referral/${emailAddress}/?companyId=${companyId}&status=${status}`,this.authService.getHttpOptions()).toPromise();
  }

  updateReferralStatus(referralId:any, data:any) {
    return this.http.put(`${API_URL}emp/referral/${referralId}/action`,data,this.authService.getHttpOptions()).toPromise(); 
  }

  getChooseAvailability(emailAddress:string): Promise<any> {
    return this.http.get(`${API_URL}user/prashant@worko.ai/availability`,this.authService.getHttpOptions()).toPromise();
  }

}
