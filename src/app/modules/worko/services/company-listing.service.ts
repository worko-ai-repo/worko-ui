import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
// import { RequesterInfo, studentData} from '../interfaces/requester.interface';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CompanyListingService {





  /**
   * ProductService constructor.
   *
   * @param {HttpClient} http
   * @param {AuthService} authService
   */
  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Get Company Listing.
   *
   * @returns {Promise<any>}
   */
  getCompanyListing(pageSize: number,  lastKey?: string): Promise<any> {
    const params: any = { pageSize };

    if (lastKey) {
      params.lastKey = lastKey;
    }
    return this.http.get(API_URL + 'company/list?pageSize='+pageSize +'&lastKey='+ lastKey, this.authService.getHttpOptions()).toPromise();
  }

  /**
 * Get Company Listing.
 *
 * @returns {Promise<any>}
 */
  createReferralRequest(emailId: string, data: any): Promise<any> {
    return this.http.post(API_URL + `user/${emailId}/referral/request`, data, this.authService.getHttpOptions()).toPromise();
  }

  /**
* Get Referral Count
*
* @returns {Promise<any>}
*/
getReferralCount(emailId: string): Promise<any> {
  return this.http.get(`${API_URL}user/${emailId}/subscription/status`, this.authService.getHttpOptions()).toPromise();
}

  /**
* GetMatching Score
*
* @returns {Promise<any>}
*/
getMatchingScore(emailId: string, referralId: string): Promise<any> {
  return this.http.get(`${API_URL}user/${emailId}/referral/${referralId}/score`, this.authService.getHttpOptions()).toPromise();
}


}


