import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
// import { RequesterInfo, studentData} from '../interfaces/requester.interface';
import { environment } from '../../../../environment/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
  async getCompanyListing(pageSize: number, lastKey?: string, teamSize?: any, industryName?: any, companyName?: string): Promise<any> {
    let url = `${API_URL}company?pageSize=${pageSize}`;

    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }

    if (teamSize) {
      url += `&teamSize=${teamSize}`;
    }
    if (industryName) {
      url += `&industry=${industryName}`;
    }
    if (companyName) {
      url += `&companyName=${companyName}`;
    }
    try {
      return await this.http.get(url, this.authService.getHttpOptions()).toPromise();
    } catch (error) {
      console.error('Error fetching company listing:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
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


  /**request New Company 
   *
* @returns {Promise<any>}
  */

  requestNewCompany(data: any): Promise<any> {
  return this.http.post(API_URL + `company/add`, data, this.authService.getHttpOptions()).toPromise();
}

 /**Get New Company List
   *
* @returns {Promise<any>}
  */
 getAllNewCompany(): Promise<any> {
  return this.http.get(API_URL + `company/new`,  this.authService.getHttpOptions()).toPromise();
}
// private item: any;
// //private event: Event;
// event: Event | undefined;
  // private referralSubject = new Subject<any>();

  // referralRequested$ = this.referralSubject.asObservable();

  // requestReferral(item: any) {
  //   this.referralSubject.next( item);
  // }
   data = new BehaviorSubject<any>(null);



  getData() {
    return this.data.asObservable();
  }

  setData(data: any) {
    this.data.next(data);
  }


}


