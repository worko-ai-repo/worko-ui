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

  async getAllIssues(pageSize?: any, lastKey?: any,sortOrder?:string,fromDate?:string,toDate?:string,searchText?:string) {
    let url = `${API_URL}admin/support?pageSize=${pageSize}`;

    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }
    if (fromDate) {
      url += `&fromDate=${fromDate}`;
    }
    if (toDate) {
      url += `&toDate=${toDate}`;
    }  if (searchText) {
      const searchTexts =encodeURIComponent(searchText)
      url += `&searchText=${searchTexts}`;
    }
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

    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }


  getAllSubscriptions(pageSize?: any, lastKey?: any,sortOrder?:string,fromDate?:string,toDate?:string,searchText?:string) {
    let url = `${API_URL}admin/subscription?pageSize=${pageSize}`;

    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }
    if (fromDate) {
      url += `&fromDate=${fromDate}`;
    }
    if (toDate) {
      url += `&toDate=${toDate}`;
    }  if (searchText) {
      const searchTexts =encodeURIComponent(searchText)
      url += `&searchText=${searchTexts}`;
    }
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }

  getAllReferral(pageSize?: any, lastKey?: any,sortOrder?:string,fromDate?:string,toDate?:string,searchText?:string) {
    let url = `${API_URL}admin/referral?pageSize=${pageSize}`;

    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }
    if (fromDate) {
      url += `&fromDate=${fromDate}`;
    }
    if (toDate) {
      url += `&toDate=${toDate}`;
    }  if (searchText) {
      const searchTexts =encodeURIComponent(searchText)
      url += `&searchText=${searchTexts}`;
    }
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }

  getAllUserData(userType: any, pageSize?: any, lastKey?: any,searchText?:any) {
    let url = `${API_URL}admin/user/?userType=${userType}`;
  
    if (pageSize) {
      url += `&pageSize=${pageSize}`;
    }
    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }
    if (searchText) {
      const searchTexts =encodeURIComponent(searchText)
      url += `&searchText=${searchTexts}`;
    }

  
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }
  

  getSubscriptionsById(id:any){
    return this.http.get(`${API_URL}admin/subscription/${id}`, this.authService.getHttpOptions()).toPromise();
  }

  getIssuesById(id:any){
    return this.http.get(`${API_URL}admin/support/${id}`, this.authService.getHttpOptions()).toPromise();
  }

  getSubscriptionsByEmailId(emailId:any){
    return this.http.get(`${API_URL}admin/user/${emailId}/subscription`, this.authService.getHttpOptions()).toPromise();
  }

  getUserByEmailId(userEmailid:any){
    return this.http.get(`${API_URL}admin/user/${userEmailid}/detail`, this.authService.getHttpOptions()).toPromise();
  }

  getUserExperienceByEmailId(userEmailid:any){
    return this.http.get(`${API_URL}admin/user/${userEmailid}/experience`, this.authService.getHttpOptions()).toPromise();
  }

  getUserSubscriptionByEmailId(userEmailid:any){
    return this.http.get(`${API_URL}admin/user/${userEmailid}/subscription`, this.authService.getHttpOptions()).toPromise();
  }

  getEmployeeReferralByEmailId(userEmailid:any){
    return this.http.get(`${API_URL}admin/user/${userEmailid}/emp-referral-responses`, this.authService.getHttpOptions()).toPromise();
  }
 
  getReferralById(id:any){
    return this.http.get(`${API_URL}admin/referral/${id}`, this.authService.getHttpOptions()).toPromise();
  }

  getCompanyById(id:any){
    return this.http.get(`${API_URL}admin/company/${id}`, this.authService.getHttpOptions()).toPromise();
  }

}
