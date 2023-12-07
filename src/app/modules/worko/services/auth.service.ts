import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
// import { AuthService } from '../../auth/services/auth.service';
// import { RequesterInfo, studentData} from '../interfaces/requester.interface';
 import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';

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
  constructor(private http: HttpClient) { }

  /**
   * Create Requester.
   *
   * @link https://transcript-api.verif-y.internal/swagger-ui/#/requester-controller/createRequesterUserProfileUsingPOST
   *
   * @param {RequesterInfo} RequesterInfo
   * @returns {Promise<any>}
   */
  createCandidate(candidateInfo: any): Observable<any> {
    return this.http.post(API_URL + 'user/signup', candidateInfo, this.getHttpOptions());
  }

  /**
   * Create Student.
   *
   * @link https://transcript-api.verif-y.internal/swagger-ui/#/requester-controller/createStudentProfileUsingPOST
   *
   * @param {number | string } studentData
   * @returns {Promise<any>}
   */
  // createStudent(studentData: studentData): Promise<any> {
  //   return this.http.post(API_URL + `requester/transcript/request`,studentData, this.authService.getHttpOptions()).toPromise();
  // }

   /**
   * Get Http Options.
   *
   * @param {boolean} [authorization = true]
   * @param {any} [params = {}]
   * @returns {any}
   */
   getHttpOptions(authorization: boolean = true, params: any = {}): any {
    let headers: any = { 'Content-Type': 'application/json' };

    if (authorization) {
      headers.Authorization = `Bearer ${this.getAccessToken()}`;
    }

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
   * Get access token.
   *
   * @returns {string}
   */
    getAccessToken(): string {
      // return this.storage.get('accessToken') || '';
      return "abc";
    }


}

