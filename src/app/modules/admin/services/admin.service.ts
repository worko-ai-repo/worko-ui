import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../worko/services/auth.service';
import { environment } from 'src/environments/environment';
import { Observable, catchError } from 'rxjs';
import { ReferralJobApplicationStatus, WithdrawalStatus } from '../../shared/enums/refer-and-earn.enums';
const API_URL = environment.apiUrl;
const JOB_BASE_URL = environment.jobBaseUrl;

export type ReferAndEarnStatusUpdatePayload =
  | { jobApplicationStatus: ReferralJobApplicationStatus }
  | { status: WithdrawalStatus.WITHDRAWAL_ACCEPTED }
  | { status: WithdrawalStatus.WITHDRAWAL_REJECTED; withDrawalRequestRejectedReason: string }
  | {
    status: WithdrawalStatus.PAYMENT_COMPLETED;
    paymentDoneDetails: {
      userId: string;
      userType: 'ADMIN';
      actionDate: string;
      amountPaid: number;
      uniqueTransactionReference: string;
    };
  };


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private referAndEarnBaseUrl = JOB_BASE_URL + 'refer-and-earn';

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
    //  console.log(`params ${param.pageSize} ${param.lastKey} ${param.status} ${param.sortOrder}`);
    let url = `${JOB_BASE_URL}job/?pageSize=${param.pageSize}`;
    if (param.status) {
      url += `&status=${param.status}`;
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
    url += `&dashboard=ADMIN`;
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }
  //POST DATA
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
    if (payload.location?.city) {
      const cityValues = Array.isArray(payload.location.city) ? payload.location.city : [payload.location.city];

      payload.location = {
        city: cityValues,
        fullLocation: [...cityValues] // Ensures fullLocation is the same as city
      };
    }

    // Remove UI helper field before sending request
    delete payload.cityControl;

    return this.http.put(`${JOB_BASE_URL}job/${jobId}`, payload, this.authService.getHttpOptions()).toPromise();
  }

  deleteJob(jobId: string, jobData: object) {
    return this.http.put(`${JOB_BASE_URL}job/${jobId}/delete`, jobData, this.authService.getHttpOptions()).toPromise();
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
  getCorporateUsers(params: any): Promise<any> {
    let url = `${API_URL}corporate-user/?pageSize=${params.pageSize}`;

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

  deleteCorporateUserById(userId: string) {
    return this.http.patch(`${API_URL}corporate-user/${userId}/delete`, {}, this.authService.getHttpOptions()).toPromise();
  }

  // Corporate Users Invite API

  getCorporateInvites(params: any): Promise<any> {
    let url = `${API_URL}corporate-invite/?pageSize=${params.pageSize}`;

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

  updateInviteStatus(inviteId: string, inviteStatus: string) {
    return this.http.patch(`${API_URL}corporate-invite/${inviteId}`, { inviteStatus }, this.authService.getHttpOptions()).toPromise();
  }

  deleteInvite(inviteId: string) {
    return this.http.patch(`${API_URL}corporate-invite/${inviteId}/delete`, {}, this.authService.getHttpOptions()).toPromise();
  }

  // API's for Admin Applicants page

  // API's for Corporate Applicants page

  getJobDetailsById(jobId: string) {
    return this.http.get(JOB_BASE_URL + `job/${jobId}`, this.authService.getHttpOptions()).toPromise();
  }

  getAllJobApplicants(pageSize: any, userType: any, jobId: any, status: any, lastKey?: any, sortOrder?: string, searchText?: any) {
    let url = `${JOB_BASE_URL}job-application/?jobId=${jobId}&userType=${userType}&pageSize=${pageSize}`;

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

  displayJobApplicationToCorporate(jobApplicationId: string): Promise<any> {
    const url = `${JOB_BASE_URL}job-application/${jobApplicationId}/display-to-corporate`;
    const payload = { displayToCorporate: true };
    return this.http.patch(url, payload, this.authService.getHttpOptions()).toPromise();
  }

  parseJD(jobDescription: object): Promise<any> {
    return this.http.post(`${JOB_BASE_URL}job/parsejd`, jobDescription, this.authService.getHttpOptions()).toPromise();
  }

  getSingleCvDetails(companyId: string, cloudFileName: string, corporateBulkJdId: string): Promise<any> {
    const url = `${API_URL}file/${companyId}/${cloudFileName}/BULK_CVS?corporateBulkJdId=${corporateBulkJdId}`;
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }

  getScreenedList(pageSize: any, lastKey?: any, sortOrder?: string, searchText?: any): Promise<any> {
    let url = `${API_URL}corporate-bulk-jd/?pageSize=${pageSize}`;
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

  getBulkJDDetailsById(corporateBulkJdId: string): Promise<any> {
    const url = `${API_URL}corporate-bulk-jd/${corporateBulkJdId}`;
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }

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

  //admin company section

  getCompanyList(pageSize?: number, lastKey?: any, sortOrder?: string, searchText?: any, selectedIndustry?: string): Promise<any> {
    let url = `${API_URL}company/?pageSize=${pageSize || 50}`;

    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }
    if (searchText) {
      const searchTexts = encodeURIComponent(searchText);
      url += `&companyName=${searchTexts}`;
    }

    if (selectedIndustry) {
      const industryName = encodeURIComponent(selectedIndustry);
      url += `&industryName=${industryName}`;
    }

    return this.http.get(url, this.authService.getHttpOptions()).toPromise();
  }

  createCompany(companyData: {
    name: string;
    industry: string;
    teamSize: number;
    carrierPage: string;
    linkedIn: string;
    logoUrl: string;
    logo: string;
    aboutCompany: string; // New field
  }): Promise<any> {
    const url = `${API_URL}company/`;

    // Ensure mandatory empty strings if not provided
    companyData.logoUrl = companyData.logoUrl || "";
    companyData.logo = companyData.logo || "";

    return this.http.post(url, companyData, this.authService.getHttpOptions()).toPromise();
  }

  updateCompany(companyId: string, companyData: any, isCompanyRequestPageFlag: boolean): Promise<any> {
    const url = `${API_URL}company/${companyId}/`;
    const payload = {
      ...companyData,
      isCompanyRequestPageFlag // Adding the flag to the request body
    };

    return this.http.put(url, payload, this.authService.getHttpOptions()).toPromise();
  }

  deleteCompany(companyId: string): Promise<any> {
    const url = `${API_URL}company/${companyId}`;
    return this.http.delete(url, this.authService.getHttpOptions()).toPromise();
  }

  // Admin Company Request page API's

  getCompanyRequests(pageSize?: number, lastKey?: any, sortOrder?: string, searchText?: any): Promise<any> {
    let url = `${API_URL}company/request/list/?pageSize=${pageSize || 50}&status=new`;

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

  deleteCompanyRequest(companyId: string): Promise<any> {
    const url = `${API_URL}company/${companyId}/request`;
    return this.http.delete(url, this.authService.getHttpOptions()).toPromise();
  }

  createCompanyRequest(requestData: { userType: string; companyDetail: { name: string; industry: string; carrierPage: string; linkedIn: string }; userEmail: string; userContactNumber: string }): Promise<any> {
    const url = `${API_URL}company/request`;
    return this.http.post(url, requestData, this.authService.getHttpOptions()).toPromise();
  }

  submitJD(payload: any): Promise<any> {
    return this.http.post(`${API_URL}corporate-bulk-jd/`, payload, this.authService.getHttpOptions()).toPromise();
  }

  uploadBulkCvs(id: string, bulkCvs: any[]): Promise<any> {
    return this.http.post(`${API_URL}corporate-bulk-jd/${id}/resumes`, { bulkCvs }, this.authService.getHttpOptions()).toPromise();
  }

  uploadResumeToS3(url: string, file: File, awsS3Tag?: string): Promise<any> {
    const httpOptions = this.authService.getHttpOptions(false, {
      awsS3Tag: awsS3Tag,
      fileType: file.type
    });

    return this.http.put(url, file, httpOptions).toPromise();
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

  // Refer & Earn API's

  // 1. GET: Admin - by status + job application status
  getReferAndEarnByStatusAndJobStatus(pageSize: any, withdrawlStatus?: string | null, referralStatus?: string | null, lastKey?: string | null, searchText?: string) {
    let params = new HttpParams().set('pageSize', pageSize);

    if (withdrawlStatus) params = params.set('status', withdrawlStatus);
    if (referralStatus) params = params.set('jobApplicationStatus', referralStatus);
    if (lastKey) params = params.set('lastKey', lastKey);
    if (searchText) params = params.set('searchText', searchText);

    const options = {
      ...this.authService.getHttpOptions(),
      params,
    };
    return this.http.get(`${this.referAndEarnBaseUrl}`, options).toPromise();
  }

  // 2. GET: By companyId (Admin Dashboard)
  getReferAndEarnByCompanyId(companyId: string) {
    const params = new HttpParams().set('companyId', companyId);
    const options = {
      ...this.authService.getHttpOptions(),
      params,
    };
    return this.http.get(`${this.referAndEarnBaseUrl}`, options).toPromise();
  }

  // 3. GET: By jobId
  getReferAndEarnByJobId(jobId: string) {
    const params = new HttpParams().set('jobId', jobId);
    const options = {
      ...this.authService.getHttpOptions(),
      params,
    };
    return this.http.get(`${this.referAndEarnBaseUrl}`, options).toPromise();
  }

  // 4. GET: By userJobApplicationId
  getReferAndEarnByUserJobApplicationId(userJobApplicationId: string) {
    const params = new HttpParams().set('userJobApplicationId', userJobApplicationId);
    const options = {
      ...this.authService.getHttpOptions(),
      params,
    };
    return this.http.get(`${this.referAndEarnBaseUrl}`, options).toPromise();
  }

  // 5. GET: Search filter
  searchReferAndEarn(searchText: string) {
    const params = new HttpParams().set('searchText', searchText);
    const options = {
      ...this.authService.getHttpOptions(),
      params,
    };
    return this.http.get(`${this.referAndEarnBaseUrl}`, options).toPromise();
  }

  // 6. GET: By ID
  getReferAndEarnById(id: string) {
    return this.http.get(`${this.referAndEarnBaseUrl}/${id}`, this.authService.getHttpOptions()).toPromise();
  }

  // 7. PATCH: Update status of a referral
  updateReferAndEarnStatus(id: string, payload: ReferAndEarnStatusUpdatePayload) {
    const url = `${this.referAndEarnBaseUrl}/${id}`;
    return this.http.patch(url, payload, this.authService.getHttpOptions()).toPromise();
  }

}