import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../worko/services/auth.service';
import { environment } from 'src/environments/environment';
const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  async getAllIssues(issuesStatus?: any) {
    // let url = `${API_URL}support`;

    // if (issuesStatus) {
    //   url += `/status=RESOLVED`;
    // }
    // try {
    
    //   return await this.http.get(url, this.authService.getHttpOptions()).toPromise();
    // } catch (error) {
    //   console.error('Error fetching issues:', error);
    //   throw error; // Rethrow the error to be handled by the caller
    // }

    return this.http.get(`${API_URL}admin/support/`, this.authService.getHttpOptions()).toPromise();
  }

  getAllDisputes() {
    return this.http.get(`${API_URL}admin/disputes`, this.authService.getHttpOptions()).toPromise();
  }

  getAllSubscriptions() {
    return this.http.get(`${API_URL}admin/subscriptions`, this.authService.getHttpOptions()).toPromise();
  }

  getAllReferral() {
    return this.http.get(`${API_URL}admin/ref/details`, this.authService.getHttpOptions()).toPromise();
  }

  getAllCandidate(){
    return this.http.get(`${API_URL}admin/user/CAND`, this.authService.getHttpOptions()).toPromise();
  }

  getAllEmployee(){
    return this.http.get(`${API_URL}admin/user/EMP`, this.authService.getHttpOptions()).toPromise();
  }






}
