import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
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
  getCompanyListing(): Observable<any> {
    return this.http.get(API_URL + 'company/list', this.authService.getHttpOptions());
  }

    /**
   * Get Company Listing.
   *
   * @returns {Promise<any>}
   */
    createReferralRequest(emailId: string, data: any): Observable<any> {
      return this.http.post(API_URL + 'user/${emailId}/referral/request', data, this.authService.getHttpOptions());
    }

}


