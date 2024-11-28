import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../worko/services/auth.service';
import { environment } from 'src/environments/environment';
import { Observable, catchError } from 'rxjs';
const API_URL = environment.apiUrl;
const API_URL_local = "http://localhost:3000/local/"


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  async getAllIssues(pageSize?: any, lastKey?: any, sortOrder?: string, fromDate?: string, toDate?: string, searchText?: string,) {
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
    } if (searchText) {
      const searchTexts = encodeURIComponent(searchText)
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


  getAllSubscriptions(pageSize?: any, lastKey?: any, sortOrder?: string, fromDate?: string, toDate?: string, searchText?: string) {
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
    } if (searchText) {
      const searchTexts = encodeURIComponent(searchText)
      url += `&searchText=${searchTexts}`;
    }
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }

  getAllReferral(pageSize?: any, lastKey?: any, sortOrder?: string, fromDate?: string, toDate?: string, searchText?: string, status?: string) {
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
    } 
    if (searchText) {
      const searchTexts = encodeURIComponent(searchText)
      url += `&searchText=${searchTexts}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }

  getAllUserData(userType: any, pageSize?: any, lastKey?: any, searchText?: any, sortOrder?: string, fromDate?: string, toDate?: string) {
    let url = `${API_URL}admin/user/?userType=${userType}`;

    if (pageSize) {
      url += `&pageSize=${pageSize}`;
    }
    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }
    if (searchText) {
      const searchTexts = encodeURIComponent(searchText)
      url += `&searchText=${searchTexts}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }
    if (fromDate) {
      url += `&fromDate=${fromDate}`;
    }
    if (toDate) {
      url += `&toDate=${toDate}`;
    }


    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }


  getSubscriptionsById(id: any) {
    return this.http.get(`${API_URL}admin/subscription/${id}`, this.authService.getHttpOptions()).toPromise();
  }

  getIssuesById(id: any) {
    return this.http.get(`${API_URL}admin/support/${id}`, this.authService.getHttpOptions()).toPromise();
  }

  getSubscriptionsByEmailId(emailId: any) {
    return this.http.get(`${API_URL}admin/user/${emailId}/subscription`, this.authService.getHttpOptions()).toPromise();
  }

  getUserByEmailId(userEmailid: any) {
    return this.http.get(`${API_URL}admin/user/${userEmailid}/detail`, this.authService.getHttpOptions()).toPromise();
  }

  getUserExperienceByEmailId(userEmailid: any) {
    return this.http.get(`${API_URL}admin/user/${userEmailid}/experience`, this.authService.getHttpOptions()).toPromise();
  }

  getUserSubscriptionByEmailId(userEmailid: any) {
    return this.http.get(`${API_URL}admin/user/${userEmailid}/subscription`, this.authService.getHttpOptions()).toPromise();
  }

  getEmployeeReferralByEmailId(userEmailid: any) {
    return this.http.get(`${API_URL}admin/user/${userEmailid}/emp-referral-responses`, this.authService.getHttpOptions()).toPromise();
  }

  getReferralById(id: any) {
    return this.http.get(`${API_URL}admin/referral/${id}`, this.authService.getHttpOptions()).toPromise();
  }

  getCompanyById(id: any) {
    return this.http.get(`${API_URL}admin/company/${id}`, this.authService.getHttpOptions()).toPromise();
  }

  getCVUrl(userId: any, filename: any) {
    return this.http.get(`${API_URL}file/${userId}/${filename}/USER_RESUME`, this.authService.getHttpOptions()).toPromise();
  }

  getJobs(param: any): Promise<any> {
/*     console.log(`params ${param.pageSize} ${param.lastKey} ${param.status} ${param.sortOrder}`);
 */    let url = `${API_URL}admin/job/?pageSize=${param.pageSize}`;
    if (param.status) {
      url += `&status=${param.status}`;
    }
    if (param.searchText) {
      const searchTextEncoded = encodeURIComponent(param.searchText);
/*       console.log(`service serachText ${searchTextEncoded}`);
 */      url += `&searchText=${searchTextEncoded}`;
/*       console.log(`After searchText ${url}`);
 */    }
    if (param.lastKey) {
      url += `&lastKey=${param.lastKey}`;
    }
    if (param.sortOrder) {
      url += `&sortOrder=${param.sortOrder}`;
    }
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }
  //POST DATA
  createJob(jobData: any) {
    return this.http.post(`${API_URL}admin/job/`, jobData, this.authService.getHttpOptions()).toPromise();
  }

  archiveJob(jobId: string, jobData: object) {
    return this.http.put(`${API_URL}admin/job/${jobId}`, jobData, this.authService.getHttpOptions()).toPromise();
  }
  updateJob(jobId: string, jobData: object) {
    return this.http.put(`${API_URL}admin/job/${jobId}`, jobData, this.authService.getHttpOptions()).toPromise();
  }
  deleteJob(jobId: string, jobData: object) {
    return this.http.put(`${API_URL}admin/job/${jobId}/delete`, jobData, this.authService.getHttpOptions()).toPromise();
  }

  // For fetching the dynamic dropdown values
  getCompanyName(value: any): Observable<any> {
    let url = `${API_URL}company`;

    if (value) {
      const companyName = encodeURIComponent(value)
      url += `?companyName=${companyName}`;
    }

    //return this.http.get(API_URL + `company/${value}`, this.getHttpOptions())
    return this.http.get(url, this.authService.getHttpOptions())
      .pipe(
        catchError(error => {
/*           console.error('Error:', error);
 */          throw error;
        })
      );
  }

  // Corporate Users API
  getCorporateInvites(params: any): Promise<any> {
    let url = `${API_URL_local}corporate/invite/?pageSize=${params.pageSize}`;

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
  // Corporate Users API
  getCorporateUsers(params: any): Promise<any> {
    let url = `${API_URL_local}corporate/invite/?pageSize=${params.pageSize}`;

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