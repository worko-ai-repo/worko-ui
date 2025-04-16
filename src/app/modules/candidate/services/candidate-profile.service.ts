import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../worko/services/auth.service';
import { of } from 'rxjs';



const API_URL = environment.apiUrl;
const JOB_BASE_URL = environment.jobBaseUrl;
// const CREATE_ORDER_URL = environment.createOrderUrl;
// const apiOrderUrl = 'https://uat1.billdesk.com/u2/payments/ve1_2/orders/create';

@Injectable({
  providedIn: 'root'
})
export class CandidateProfileService {

  private referAndEarnBaseUrl = JOB_BASE_URL + 'refer-and-earn';

  /** 
    @param {HttpClient} http
    */
  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
    @returns {Promise<any>}
   */
  getUserProfile(emailAddress: string): Promise<any> {
    return this.http.get(`${API_URL}user/${emailAddress}/socialprofile`, this.authService.getHttpOptions()).toPromise();
  }
  getUserDetails(emailAddress: string): Promise<any> {
    return this.http.get(`${API_URL}user/${emailAddress}/details`, this.authService.getHttpOptions()).toPromise();
  }

  getUserDetailsById(userId: string): Promise<any> {
    return this.http.get(`${API_URL}user/${userId}/detail`, this.authService.getHttpOptions()).toPromise();
  }

  getCandidateSkills(emailAddress: string): Promise<any> {
    return this.http.get(`${API_URL}user/${emailAddress}/skill`, this.authService.getHttpOptions()).toPromise();
  }
  getCandidateAchievements(emailAddress: string): Promise<any> {
    return this.http.get(`${API_URL}user/${emailAddress}/achievement`, this.authService.getHttpOptions()).toPromise();
  }
  getCandidateEducation(emailAddress: string) {
    return this.http.get(`${API_URL}user/${emailAddress}/education`, this.authService.getHttpOptions()).toPromise();
  }

  getWorkExperience(emailAddress: string) {
    return this.http.get(`${API_URL}user/${emailAddress}/experience`, this.authService.getHttpOptions()).toPromise();
  }


  getServices(emailAddress: string, status: string) {
    return this.http.get(`${API_URL}user/${emailAddress}/service?status=${status}`, this.authService.getHttpOptions()).toPromise();
  }

  getProfileComplete(emailAddress: string): Promise<any> {
    return this.http.get(API_URL + `user/${emailAddress}/profilePercentage `, this.authService.getHttpOptions()).toPromise();
  }

  /*************REferral APIS */

  async getReferral(emailAddress: string, status: string, lastKey?: string): Promise<any> {
    // console.log("lastkey in service is", lastKey)

    let url = `${API_URL}user/${emailAddress}/referral?status=${status}`;

    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }

    try {
      return await this.http.get(url, this.authService.getHttpOptions()).toPromise();
    } catch (error) {
      console.error('Error fetching referral list:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
    // return this.http.get(`${API_URL}user/${emailAddress}/referral?status=${status}`, this.authService.getHttpOptions()).toPromise();
  }

  markasDoneReferral(emailAddress: string, status: string, referralId: string) {
    return this.http.put(`${API_URL}user/${emailAddress}/referral/${referralId}/${status}`, {}, this.authService.getHttpOptions()).toPromise();
  }

  createReview(userId: string, data: any): Promise<any> {
    return this.http.post(API_URL + `user/${userId}/review`, data, this.authService.getHttpOptions()).toPromise();
  }

  getReview(userId: string, referralId: any): Promise<any> {
    return this.http.get(`${API_URL}user/${userId}/review/received?referalId=${referralId}`, this.authService.getHttpOptions()).toPromise();
  }

  raiseIssue(data: any): Promise<any> {
    return this.http.post(API_URL + `support/`, data, this.authService.getHttpOptions()).toPromise();
  }

  withdrawReferral(emailAddress: string, status: string, referralId: string, data: any) {
    return this.http.put(`${API_URL}user/${emailAddress}/referral/${referralId}/${status}`, data, this.authService.getHttpOptions()).toPromise();
  }

  /*************Services API */

  markasDoneService(emailAddress: string, status: string, serviceId: string) {
    return this.http.patch(`${API_URL}user/${emailAddress}/service/${serviceId}/${status}`, {}, this.authService.getHttpOptions()).toPromise();
  }

  createEducation(emailAddress: string, data: any): Promise<any> {
    return this.http.post(API_URL + `user/${emailAddress}/education`, data, this.authService.getHttpOptions()).toPromise();
  }
  createAchievments(emailAddress: string, data: any): Promise<any> {
    return this.http.post(API_URL + `user/${emailAddress}/achievement`, data, this.authService.getHttpOptions()).toPromise();
  }
  createUserProfile(emailAddress: string, data: any): Promise<any> {
    return this.http.post(API_URL + `user/${emailAddress}/socialprofile`, data, this.authService.getHttpOptions()).toPromise();
  }

  createUserDetails(emailAddress: string, data: any): Promise<any> {
    return this.http.put(API_URL + `user/${emailAddress}/details`, data, this.authService.getHttpOptions()).toPromise();
  }
  createUserSkills(emailAddress: string, data: any): Promise<any> {
    return this.http.post(API_URL + `user/${emailAddress}/skill`, data, this.authService.getHttpOptions()).toPromise();
  }

  createWorkExperience(emailAddress: string, data: any): Promise<any> {
    return this.http.post(API_URL + `user/${emailAddress}/experience`, data, this.authService.getHttpOptions()).toPromise();
  }

  getSubscription(emailAddress: string): Promise<any> {
    return this.http.get(API_URL + `user/${emailAddress}/subscription`, this.authService.getHttpOptions()).toPromise();
  }

  uploadProfilePic(documentDetails: any): Promise<any> {
    return this.http.post(API_URL + `file/gsu2u/USER_PROFILE_PIC`, documentDetails, this.authService.getHttpOptions())
      .toPromise()
      .then(response => response as ArrayBuffer);
  }
  // createReferralRequest(emailId: string, data: any): Promise<any> {
  //   return this.http.post(API_URL + `user/${emailId}/referral/request`, data, this.authService.getHttpOptions()).toPromise();
  // }



  deleteUserCollege(emailAddress: string, sk: any): Promise<any> {
    return this.http.delete(API_URL + `user/${emailAddress}/education/${sk}`, this.authService.getHttpOptions()).toPromise();
  }


  /* Email opt verification for employee */
  employeeEmailVerification(emailAddress: string, id: any): Promise<any> {
    return this.http.get(API_URL + `user/${emailAddress}/experience/${id}/request-otp`, this.authService.getHttpOptions()).toPromise();

  }

  verifyOtp(emailAddress: any, id: any, otp: any): Promise<any> {
    return this.http.post(API_URL + `user/${emailAddress}/experience/${id}/verify-otp`, { otp: otp }, this.authService.getHttpOptions()).toPromise();

  }


  //Create order API - Subscription module

  createOrder(data: any, userId: any): Promise<any> {
    return this.http.post(API_URL + `user/${userId}/order/create`, data, this.authService.getHttpOptions()).toPromise();
  }

  //API to process the payment

  processPayment(data: any, userId: any) {
    return this.http.post(API_URL + `user/${userId}/order/gatewayres`, data, this.authService.getHttpOptions()).toPromise();
  }

  createSubscription(emailAddress: any, data: any) {
    return this.http.post(API_URL + `user/${emailAddress}/subscription`, data, this.authService.getHttpOptions()).toPromise();
  }

  getSubscriptionStatus(emailAddress: any) {
    return this.http.get(API_URL + `user/${emailAddress}/subscription/status`, this.authService.getHttpOptions()).toPromise();
  }

  // Candidate Jobs API

  getAllJobApplication(userType: string, emailAddress: string, status: string, pageSize: any, lastKey?: string) {
    const emailAddressEncoded = encodeURIComponent(emailAddress);
    let url = `${JOB_BASE_URL}job-application/?status=${status}&userEmail=${emailAddressEncoded}&userType=${userType}&pageSize=${pageSize}`;

    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }

    try {
      return this.http.get(url, this.authService.getHttpOptions()).toPromise();
    } catch (error) {
      console.error('Error fetching Job Applications listing:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }


  jobApplicationRequestFeedback(jobId: any, data: any) {
    return this.http.patch(JOB_BASE_URL + `job-application/${jobId}/request-feedback`, data, this.authService.getHttpOptions()).toPromise();
  }

  // markasDoneService(emailAddress: string, status: string, serviceId: string) {
  //   return this.http.patch(`${API_URL}user/${emailAddress}/service/${serviceId}/${status}`, {}, this.authService.getHttpOptions()).toPromise();
  // }


  // 1. GET: List referrals by referrerEmail (Candidate/Employee Dashboard)
  getReferAndEarnByReferrerEmail(referrerEmail: string, pageSize: any, lastKey?: string | null) {
    let params = new HttpParams()
      .set('referrerEmail', referrerEmail)
      .set('pageSize', pageSize);

    if (lastKey) {
      params = params.set('lastKey', lastKey);
    }

    const options = {
      ...this.authService.getHttpOptions(),
      params,
    };

    return this.http.get(`${this.referAndEarnBaseUrl}`, options).toPromise();
  }


  // 2. GET: Admin - by status + job application status
  getReferAndEarnByStatusAndJobStatus(status?: string, jobApplicationStatus?: string) {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (jobApplicationStatus) params = params.set('jobApplicationStatus', jobApplicationStatus);

    const options = {
      ...this.authService.getHttpOptions(),
      params,
    };
    return this.http.get(`${this.referAndEarnBaseUrl}`, options).toPromise();
  }

  // 3. GET: By companyId (Admin Dashboard)
  getReferAndEarnByCompanyId(companyId: string) {
    const params = new HttpParams().set('companyId', companyId);
    const options = {
      ...this.authService.getHttpOptions(),
      params,
    };
    return this.http.get(`${this.referAndEarnBaseUrl}`, options).toPromise();
  }

  // 4. GET: By jobId
  getReferAndEarnByJobId(jobId: string) {
    const params = new HttpParams().set('jobId', jobId);
    const options = {
      ...this.authService.getHttpOptions(),
      params,
    };
    return this.http.get(`${this.referAndEarnBaseUrl}`, options).toPromise();
  }

  // 5. GET: By userJobApplicationId
  getReferAndEarnByUserJobApplicationId(userJobApplicationId: string) {
    const params = new HttpParams().set('userJobApplicationId', userJobApplicationId);
    const options = {
      ...this.authService.getHttpOptions(),
      params,
    };
    return this.http.get(`${this.referAndEarnBaseUrl}`, options).toPromise();
  }

  // 6. GET: Search filter
  searchReferAndEarn(searchText: string) {
    const params = new HttpParams().set('searchText', searchText);
    const options = {
      ...this.authService.getHttpOptions(),
      params,
    };
    return this.http.get(`${this.referAndEarnBaseUrl}`, options).toPromise();
  }

  // 7. GET: By ID
  getReferAndEarnById(id: string) {
    return this.http.get(`${this.referAndEarnBaseUrl}/${id}`, this.authService.getHttpOptions()).toPromise();
  }

  // 8. PATCH: Update status of a referral
  updateReferAndEarnStatus(id: string, email: string, payload: { status: 'PENDING' | 'APPROVED' }) {
    const url = `${this.referAndEarnBaseUrl}/${id}/${encodeURIComponent(email)}`;
    return this.http.patch(url, payload, this.authService.getHttpOptions()).toPromise();
  }

  // 9. PATCH: Request withdrawal
  requestWithdrawal(id: string, payload: {
    accountHolderName: string;
    accountNumber: number;
    ifscCode: string;
    branchName: string;
  }) {
    const url = `${this.referAndEarnBaseUrl}/${id}/request-withdrawal`;
    return this.http.patch(url, payload, this.authService.getHttpOptions()).toPromise();
  }


}





