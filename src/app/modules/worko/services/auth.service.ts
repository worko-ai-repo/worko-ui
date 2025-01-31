import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, catchError } from 'rxjs';
import { candidateInfo, employeeInfo } from '../interfaces/auth.interface';
import { CognitoService } from '../../services/cognito.service';
import { CorporateUserInviteCreateDto, CorporateUserInviteUpdateApiDto } from '../../shared/interfaces/corporate-usr-invite.interface';
const API_URL = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * ProductService constructor.
   *
   * @param {HttpClient} http
   * @param {AuthService} authService
   */
  constructor(private http: HttpClient, private cognitoService: CognitoService) { }

  /**
   * Create Candidate.
   *
   * @param {RequesterInfo} candidateInfo
   * @returns {Promise<any>}
   */
  createCandidate(candidateInfo: candidateInfo): Promise<any> {
    return this.http.post(API_URL + 'user/register/candidate', candidateInfo, this.getHttpOptions()).toPromise();
  }

  /**
   * Create Employee.
   *
   * @param {number | string } employeeInfo
   * @returns {Promise<any>}
   */
  createEmployee(employeeInfo: employeeInfo): Promise<any> {
    return this.http.post(API_URL + `user/register/employee`, employeeInfo, this.getHttpOptions()).toPromise();
  }

  /**
 * Create Employee.
 *
 * @param {number | string } employeeInfo
 * @returns {Observable<any>}
 */
  uploadCV(documentDetails: any): Promise<any> {
    return this.http.post(API_URL + `file/gsu2u/USER_RESUME`, documentDetails, this.getHttpOptions())
      .toPromise()
      .then(response => response as ArrayBuffer);
  }

  uploadFileOnS3Bucket(file: File, signedUrl: string, awsS3Tag: string): Promise<any> {
    return this.http.put(signedUrl, file, this.getHttpOptions(false, { awsS3Tag: awsS3Tag, "fileType": file.type  })).toPromise()
  }

  linkResumewithUser(emailId: string, awsS3fileName: string): Promise<any> {
    return this.http.patch(API_URL + `user/${emailId}/cv`, { resume: awsS3fileName }, this.getHttpOptions())
      .toPromise()
      .then(response => response as ArrayBuffer);
  }

  getProfile(emailId: string): Promise<any> {
    return this.http.get(API_URL + `user/${emailId}/profile`, this.getHttpOptions())
      .toPromise()
      .then(response => response as ArrayBuffer);
  }

  updateProfile(emailId: string, data:any): Promise<any> {
    return this.http.put(API_URL + `user/${emailId}/updateLastAccessedDash`, data, this.getHttpOptions())
      .toPromise()
      .then(response => response as ArrayBuffer)
      .catch(error => {
        console.error('Error updating profile:', error);
        throw error;
      });
  }
  

  otpVerification(emailId: string): Promise<any> {
    return this.http.patch(API_URL + `user/${emailId}/verify/email`,{}, this.getHttpOptions())
      .toPromise()
      .then(response => response as ArrayBuffer);
  }

  getCompanyName(value: any): Observable<any> {

    let url = `${API_URL}company`;

    if (value) {
      const companyName =encodeURIComponent(value)
      url += `?companyName=${companyName}`;
    }

    //return this.http.get(API_URL + `company/${value}`, this.getHttpOptions())
    return this.http.get(url, this.getHttpOptions())
      .pipe(
        catchError(error => {
          // console.log(error)
          console.error('Error:', error);
          throw error;
        })
      );
  }



  /**
  * Get Http Options.
  *
  * @param {boolean} [authorization = true]
  * @param {any} [params = {}]
  * @returns {any}
  */
  getHttpOptions(authorization: boolean = true, params: any = {}): any {
    let headers: any = {  };
    if(!params){

     headers={'Content-Type': 'application/json'}
    }
  

    if (authorization) {
      headers.Authorization = `Bearer ${this.cognitoService.getAccessToken()}`;
      if (headers.Authorization == "Bearer ") {
        headers.Authorization = 'Bearer dummyTokenWeArePassing';
      }
      // console.log(headers.Authorization, "AccessToken");
    }
    // headers['Access-Control-Allow-Origin'] = '*';

    if (params?.xTenantId) {
      headers['X-TenantID'] = `${params.xTenantId}`;
    }

    if (params?.stateId) {
      headers['stateId'] = `${params.stateId}`;
    }

    if (params?.schoolId) {
      headers['schoolId'] = `${params.schoolId}`;
    }

    if (params?.awsS3Tag) {
      headers = { 'Content-Type': params["fileType"] };
      headers['x-amz-tagging'] = `${params.awsS3Tag}`;
    }

    const httpOptions = {
      headers: new HttpHeaders(headers),
    };

    // if (params?.params) {
    //   httpOptions['params'] = params.params;
    // }
    return httpOptions;
  }

  /**
   * Corporate Invite Section
   * 
   * This sections will have the following functions:
   * 
   * @function getInviteById - Get the invite details by the inviteId'
   * @function createCorporateUser - Create the corporate user in the cognito
   * @function sendOtpRequest - Send the OTP request to the user
   * @function verifyOtp - Verify the OTP
   * @function renewInviteRequest - Renew the invite request
   */

    // Check where it is getting called @TODO
   getInviteById(inviteId: string): Promise<any> {
      return this.http.get(`${API_URL}corporate-invite/${inviteId}`, this.getHttpOptions()).toPromise();
    }

    renewInviteRequest(inviteId: string , updateData : CorporateUserInviteUpdateApiDto): Promise<any> {
      return this.http.patch(`${API_URL}corporate-invite/${inviteId}/renew`, { renewInvite:true }, this.getHttpOptions()).toPromise();
    }
    // Check where it is getting called @TODO
    getCorporateUser(userId:string):Promise<any>{
      return this.http.get(`${API_URL}corporate-user/${userId}/cognito`,this.getHttpOptions()).toPromise()
    }

    createCorporateUser(data: any): Promise<any> {
      return this.http.post(`${API_URL}corporate-user/`, data, this.getHttpOptions()).toPromise();
    }
}

