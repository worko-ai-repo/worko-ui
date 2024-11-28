import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../worko/services/auth.service';
const API_URL = "http://localhost:3000/local/";
@Injectable({
  providedIn: 'root'
})
export class CorporateService {

  constructor(private http: HttpClient, private authService: AuthService) { }
 
  // Corporate Users API
  getCorporateUsers(params: any): Promise<any> {
    let url = `${API_URL}admin/corporate/user/?pageSize=${params.pageSize}`;

    if (params.searchText) {
      const searchTextEncoded = encodeURIComponent(params.searchText);
      url += `&searchText=${searchTextEncoded}`;
    }
    if (params.lastKey) {
      url += `&lastKey=${params.lastKey}`;
    }
    if (params.sortOrder) {
      url += `&sortOrder=${params.sortOrder}`;
    }
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }
}
