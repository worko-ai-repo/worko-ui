import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as data from 'src/assets/data/data.json';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ReqGuidanceService {

  constructor(private http: HttpClient, private authService: AuthService) { }


   /**
* Get master service
*
* @returns {Promise<any>}
*/
getMasters(): Observable<any> {
  return this.http.get( API_URL + 'service/', this.authService.getHttpOptions());
}



 /**
 * Get Company Listing.
 *
 * @returns {Promise<any>}
 */
 createreqGuidance( data:any, emailAddress:string ):Promise<any>{
  return this.http.post(API_URL + `user/${emailAddress}/service`, data, this.authService.getHttpOptions()).toPromise();
 }

}
