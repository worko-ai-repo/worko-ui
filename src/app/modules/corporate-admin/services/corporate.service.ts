import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../worko/services/auth.service';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CorporateVitalDetails } from '../corporate.component';
const API_URL = environment.apiUrl;
const JOB_BASE_URL = environment.jobBaseUrl;
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
    let url = `${JOB_BASE_URL}job/?pageSize=${param.pageSize}`;
    if (param.status) {
      url += `&status=${param.status}`;
    }
    if (param.companyId) {
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
    let payload: any = { ...jobData }; // Clone form values

    // Ensure location object is structured properly
    if (payload.location && payload.location.city) {
      payload.location = {
        city: Array.isArray(payload.location.city) ? payload.location.city : [],
        fullLocation: Array.isArray(payload.location.city) ? [...payload.location.city] : []
      };
    }
    // Remove cityControl before sending
    delete payload.cityControl;

    return this.http.post(`${JOB_BASE_URL}job/`, payload, this.authService.getHttpOptions()).toPromise();
  }
  archiveJob(jobId: string, jobData: object) {
    return this.http.put(`${JOB_BASE_URL}job/${jobId}`, jobData, this.authService.getHttpOptions()).toPromise();
  }
  updateJob(jobId: string, jobData: object) {
    let payload: any = { ...jobData }; // Clone form values

    // Ensure location object is structured properly
    if (payload.location && payload.location.city) {
      payload.location = {
        city: Array.isArray(payload.location.city) ? payload.location.city : [],
        fullLocation: Array.isArray(payload.location.city) ? [...payload.location.city] : []
      };
    }

    // Remove cityControl before sending
    delete payload.cityControl;

    return this.http.put(`${JOB_BASE_URL}job/${jobId}`, payload, this.authService.getHttpOptions()).toPromise();
  }
  deleteJob(jobId: string, jobData: object) {
    return this.http.put(`${JOB_BASE_URL}job/${jobId}/delete`, jobData, this.authService.getHttpOptions()).toPromise();
  }

  // Corporate Users API
  getCorporateUsers(params: any): Promise<any> {
    let url = `${API_URL}corporate-user/?pageSize=${params.pageSize}&companyId=${params.companyId}`;

    if (params.corporateUserType) {
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

  deleteCorporateUserById(userId: string, companyId: string): Promise<any> {
    return this.http.patch(`${API_URL}corporate-user/${userId}/delete?companyId=${companyId}`, {}, this.authService.getHttpOptions()).toPromise();
  }

  getCorporateUserDetailById(userId: string): Promise<any> {
    return this.http.get(`${API_URL}corporate-user/${userId}/cognito`, this.authService.getHttpOptions()).toPromise();
  }

  // Corporate Users Invite API
  getCorporateInvites(params: any): Promise<any> {
    let url = `${API_URL}corporate-invite/?pageSize=${params.pageSize}`;

    if (params.companyId) {
      url += `&companyId=${params.companyId}`;
    }

    if (params.corporateUserType) {
      // debugger;
      url += `&corporateUserType=${params.corporateUserType}`;
    }

    if (params.inviteStatus) {
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

  updateInviteStatus(inviteId: string, inviteStatus: string, companyId: string) {
    return this.http.patch(`${API_URL}corporate-invite/${inviteId}?companyId=${companyId}`, { inviteStatus }, this.authService.getHttpOptions()).toPromise();
  }
  deleteInvite(inviteId: string, companyId: string) {
    return this.http.patch(`${API_URL}corporate-invite/${inviteId}/delete?companyId=${companyId}`, {}, this.authService.getHttpOptions()).toPromise();
  }

  // API's for Corporate Applicants page

  getJobDetailsById(jobId: string) {
    return this.http.get(JOB_BASE_URL + `job/${jobId}`, this.authService.getHttpOptions()).toPromise();
  }

  getAllJobApplicants(pageSize: any, userType: any, companyId: any, jobId: any, status: any, lastKey?: any, sortOrder?: string, searchText?: any) {
    const encodedUserType = encodeURIComponent(userType);
    let url = `${JOB_BASE_URL}job-application/?companyId=${companyId}&jobId=${jobId}&userType=${encodedUserType}&pageSize=${pageSize}`;

    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }
    // if (fromDate) {
    //   url += `&fromDate=${fromDate}`;
    // }
    // if (toDate) {
    //   url += `&toDate=${toDate}`;
    // } 
    if (searchText) {
      const searchTexts = encodeURIComponent(searchText)
      url += `&searchText=${searchTexts}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }

  updateJobApplicationStatus(jobApplicationId: string, data: any) {
    return this.http.patch(`${JOB_BASE_URL}job-application/${jobApplicationId}/corp-action`, data, this.authService.getHttpOptions()).toPromise();
  }

  parseJD(jobDescription: object): Promise<any> {
    return this.http.post(`${JOB_BASE_URL}job/parsejdddd`, jobDescription, this.authService.getHttpOptions()).toPromise();
  }

  submitJD(payload: any): Promise<any> {
    return this.http.post(`${API_URL}corporate-bulk-jd/`, payload, this.authService.getHttpOptions()).toPromise();
  }

  // Submit Bulk JD and Resumes
  // submitBulkJD(data: object): Promise<any> {
  //   return this.http.post(`${API_URL}corporate-bulk-jd/`, data, this.authService.getHttpOptions()).toPromise();
  // }

  uploadBulkCvs(id: string, bulkCvs: any[]): Promise<any> {
    return this.http.post(`${API_URL}corporate-bulk-jd/${id}/resumes`, { bulkCvs }, this.authService.getHttpOptions()).toPromise();
  }

  // // Upload Resume to S3
  // uploadResumeToS3(url: string, file: File): Promise<any> {
  //   return this.http.put(url, file, {
  //     headers: { 'Content-Type': file.type }
  //   }).toPromise();
  // }

  uploadResumeToS3(url: string, file: File, awsS3Tag?: string): Promise<any> {
    const httpOptions = this.authService.getHttpOptions(false, {
      awsS3Tag: awsS3Tag,
      fileType: file.type
    });

    return this.http.put(url, file, httpOptions).toPromise();
  }

  // uploadFileOnS3Bucket(file: File, signedUrl: string, awsS3Tag: string): Promise<any> {
  //   return this.http.put(signedUrl, file, this.getHttpOptions(false, { awsS3Tag: awsS3Tag, "fileType": file.type  })).toPromise()
  // }

  // Check Processing Status
  getProcessingStatus(corporateBulkJdId: any, pageSize?: any, lastKey?: any, sortOrder?: string, searchText?: any, status?: string): Promise<any> {
    let url = `${API_URL}corporate-bulk-jd-resume/?corporateBulkJdId=${corporateBulkJdId}`;

    if (pageSize) {
      url += `&pageSize=${pageSize}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }
    if (searchText) {
      const searchTexts = encodeURIComponent(searchText)
      url += `&searchText=${searchTexts}`;
    }

    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }

  getScreenedListByCompanyId(companyId: any, pageSize: any, lastKey?: any, sortOrder?: string, searchText?: any): Promise<any> {
    let url = `${API_URL}corporate-bulk-jd/?companyId=${companyId}&pageSize=${pageSize}`;
    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }
    if (searchText) {
      const searchTexts = encodeURIComponent(searchText)
      url += `&searchText=${searchTexts}`;
    }
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }

  // getSingleCvDetails(companyId: any, cloudFileName: string, corporateBulkJdId: any): Promise<any> {
  //   const url = `${API_URL}file/${companyId}/${cloudFileName}/BULK_CVS`;
  //   const body = { corporateBulkJdId };
  //   return this.http.get(url, body, this.authService.getHttpOptions()).toPromise();
  // }

  getSingleCvDetails(companyId: string, cloudFileName: string, corporateBulkJdId: string): Promise<any> {
    const url = `${API_URL}file/${companyId}/${cloudFileName}/BULK_CVS?corporateBulkJdId=${corporateBulkJdId}`;
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }

  getBulkJDDetailsById(corporateBulkJdId: string): Promise<any> {
    const url = `${API_URL}corporate-bulk-jd/${corporateBulkJdId}`;
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }

}
