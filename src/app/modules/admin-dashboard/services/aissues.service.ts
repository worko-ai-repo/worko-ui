import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../worko/services/auth.service';
const API_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class AissuesService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  async getAllIssues(issuesStatus?: any) {
    let url = `${API_URL}support`;

    if (issuesStatus) {
      url += `/status=RESOLVED`;
    }
    try {
    
      return await this.http.get(url, this.authService.getHttpOptions()).toPromise();
    } catch (error) {
      console.error('Error fetching issues:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }
}
