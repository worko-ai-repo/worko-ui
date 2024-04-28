import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';


const API_URL = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class SubscriptionPackService {

/**
   * ProductService constructor.
   *
   * @param {HttpClient} http
   * @param {AuthService} authService
   */
  constructor( private http : HttpClient, private authService : AuthService) {}

  /**
 * Get subscription
 *
 * @returns {Promise<any>}
 */
   getSubscription():Observable<any>{
    return this.http.get(API_URL + 'msubscription/plans', this.authService.getHttpOptions());
   }
}
