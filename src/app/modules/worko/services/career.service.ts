import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CognitoService } from '../../services/cognito.service';
import { environment } from '../../../../environment/environment';
import { userInfo } from '../interfaces/auth.interface';
import{corporateInfo} from '../interfaces/auth.interface';
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
  constructor(private http: HttpClient, private cognitoService: CognitoService) { }

  uploadCV(documentDetails: any): Promise<any> {
    return this.http.post(API_URL + `file/gsu2u/CAREER_RESUME`, documentDetails, this.getHttpOptions(false))
      .toPromise()
      .then(response => response as ArrayBuffer);
  }

  uploadFileOnS3Bucket(file: File, signedUrl: string, awsS3Tag: string): Promise<any> {
    return this.http.put(signedUrl, file, this.getHttpOptions(false, { awsS3Tag: awsS3Tag, "fileType": file.type  })).toPromise()
  }

  linkResumewithUser(emailId: string, awsS3fileName: string): Promise<any> {
    return this.http.patch(API_URL + `user/${emailId}/cv`, { resume: awsS3fileName }, this.getHttpOptions(false))
      .toPromise()
      .then(response => response as ArrayBuffer);
  }

 /**
   * Create CareerUser.
   *
   * @param {number | string } userInfo
   * @returns {Promise<any>}
   */
 createUser(userInfo: userInfo): Promise<any> {
  return this.http.post(API_URL + `career/`, userInfo, this.getHttpOptions(false)).toPromise();
}

/**
   * Create CorporateUser.
   *
   * @param {number | string } corporateInfo
   * @returns {Promise<any>}
   */
createCorporateUser(corporateInfo: corporateInfo): Promise<any> {
  return this.http.post(API_URL + `corporate/`, corporateInfo, this.getHttpOptions(false)).toPromise();
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
    // else{
    //   headers.Authorization = 'https://api.worko.ai/corporate/';
    // }
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
}
