import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../worko/services/auth.service';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CorporateVitalDetails } from '../corporate.component';
const API_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root' // Ensures it's available application-wide
})

export class CorporateService {
  
  private corporateDetailsSubject = new BehaviorSubject<CorporateVitalDetails | null>(null);
  corporateDetails$ = this.corporateDetailsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

// ===========================================Base store for the corporate user===========================================

  setCorporateVitalDetails(details: CorporateVitalDetails): void {
    this.corporateDetailsSubject.next(details);
  }

  getCorporateVitalDetails(): CorporateVitalDetails | null {
    return this.corporateDetailsSubject.getValue();
  }
// ===========================================Base store for the corporate user===========================================
    
  // Fetch company by id
  getCompanyDetailsById(companyId: string): Promise<any> {
    return this.http.get(`${API_URL}company/${companyId}`, this.authService.getHttpOptions()).toPromise();
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
         throw error;
          })
        );
    }
  

  // Corporate Job API
  getJobs(param: any): Promise<any> {
    //  console.log(`params ${param.pageSize} ${param.lastKey} ${param.status} ${param.sortOrder}`);
    let url = `${API_URL}admin/job/?pageSize=${param.pageSize}`;
    if (param.status) {
      url += `&status=${param.status}`;
    }
    if(param.companyId){
      url += `&companyId=${param.companyId}`;
    }
    if (param.searchText) {
      const searchTextEncoded = encodeURIComponent(param.searchText);
      // console.log(`service serachText ${searchTextEncoded}`);
      url += `&searchText=${searchTextEncoded}`;
      // console.log(`After searchText ${url}`);
    }
    if (param.lastKey) {
      url += `&lastKey=${param.lastKey}`;
    }
    if (param.sortOrder) {
      url += `&sortOrder=${param.sortOrder}`;
    }
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }

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

  // Corporate Users API
  getCorporateUsers(params: any): Promise<any> {
    let url = `${API_URL}corporate-user/?pageSize=${params.pageSize}&companyId=${params.companyId}`;
    
    if(params.corporateUserType){
      // debugger;
      url += `&corporateUserType=${params.corporateUserType}`;
    }
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
  
    deleteCorporateUserById(userId: string, companyId: string) : Promise<any> {
      return this.http.patch(`${API_URL}corporate-user/${userId}/delete?companyId=${companyId}`, this.authService.getHttpOptions()).toPromise();
    }
  
   getCorporateUserDetailById(userId: string) : Promise<any>{
      return this.http.get(`${API_URL}corporate-user/${userId}/cognito`, this.authService.getHttpOptions()).toPromise();
    }

    // Corporate Users Invite API
  getCorporateInvites(params: any): Promise<any> {
    let url = `${API_URL}corporate-invite/?pageSize=${params.pageSize}`;

    if(params.companyId){
      url += `&companyId=${params.companyId}`;
    }

    if(params.corporateUserType){
      // debugger;
      url += `&corporateUserType=${params.corporateUserType}`;
    }

    if(params.inviteStatus) {
      url += `&inviteStatus=${params.inviteStatus}`;
    }
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

  createInvite(inviteData: any) {
    return this.http.post(`${API_URL}corporate-invite/`, inviteData, this.authService.getHttpOptions()).toPromise();
  }

  updateInviteStatus(inviteId: string, inviteStatus: string , companyId: string) {
    return this.http.patch(`${API_URL}corporate-invite/${inviteId}?companyId=${companyId}`, { inviteStatus }, this.authService.getHttpOptions()).toPromise();
  }
  deleteInvite(inviteId: string, companyId: string) {
    return this.http.patch(`${API_URL}corporate-invite/${inviteId}/delete?companyId=${companyId}`, this.authService.getHttpOptions()).toPromise();
  }
}
