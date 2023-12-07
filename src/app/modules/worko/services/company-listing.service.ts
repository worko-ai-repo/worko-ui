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
   * Create Requester.
   *
   * @link https://transcript-api.verif-y.internal/swagger-ui/#/requester-controller/createRequesterUserProfileUsingPOST
   *
   * @param {RequesterInfo} RequesterInfo
   * @returns {Promise<any>}
   */
  getCompanyListing(): Observable<any> {
    return this.http.get(API_URL + 'company/list', this.authService.getHttpOptions());
  }

}


