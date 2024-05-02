import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CognitoService } from '../../services/cognito.service';
import { environment } from '../../../../environment/environment';
import { userInfo } from '../interfaces/auth.interface';
import { corporateInfo } from '../interfaces/auth.interface';
import { AuthService } from './auth.service';
const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CareerService {

  /**
   * ProductService constructor.
   *
   * @param {HttpClient} http
   * @param {AuthService} authService
   */
  constructor(private http: HttpClient, private cognitoService: CognitoService, private authService: AuthService) { }

  uploadCV(documentDetails: any): Promise<any> {
    return this.http.post(API_URL + `file/gsu2u/CAREER_RESUME`, documentDetails, this.authService.getHttpOptions())
      .toPromise()
      .then(response => response as ArrayBuffer);
  }

  // uploadFileOnS3Bucket(file: File, signedUrl: string, awsS3Tag: string): Promise<any> {
  //   return this.http.put(signedUrl, file, this.authService.getHttpOptions(true, { awsS3Tag: awsS3Tag, "fileType": file.type })).toPromise()
  // }

  // linkResumewithUser(emailId: string, awsS3fileName: string): Promise<any> {
  //   return this.http.patch(API_URL + `user/${emailId}/cv`, { resume: awsS3fileName }, this.authService.getHttpOptions())
  //     .toPromise()
  //     .then(response => response as ArrayBuffer);
  // }

  /**
    * Create CareerUser.
    *
    * @param {number | string } userInfo
    * @returns {Promise<any>}
    */
  createUser(userInfo: userInfo): Promise<any> {
    return this.http.post(API_URL + `career`, userInfo, this.authService.getHttpOptions()).toPromise();
  }

  /**
     * Create CorporateUser.
     *
     * @param {number | string } corporateInfo
     * @returns {Promise<any>}
     */
  createCorporateUser(corporateInfo: corporateInfo): Promise<any> {
    return this.http.post(API_URL + `corporate`, corporateInfo, this.authService.getHttpOptions()).toPromise();
  }

}
