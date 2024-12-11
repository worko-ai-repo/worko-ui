import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
// import { RequesterInfo, studentData} from '../interfaces/requester.interface';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CompanyListingService {






  /**
   * ProductService constructor.
   *
   * @param {HttpClient} http
   * @param {AuthService} authService
   */
  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Get Company Listing.
   *
   * @returns {Promise<any>}
   */
  async getCompanyListing(pageSize: number, sortOrder?: any, lastKey?: string, teamSize?: any, industryName?: any, companyName?: string): Promise<any> {
    let url = `${API_URL}company?pageSize=${pageSize}`;

    // Append sortOrder to the URL
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }

    if (lastKey) {
      url += `&lastKey=${lastKey}`;
    }

    if (teamSize) {
      url += `&teamSize=${teamSize}`;
    }
    if (industryName) {
      url += `&industryName=${industryName}`;
    }
    if (companyName) {
      url += `&companyName=${companyName}`;
    }
    try {
      return await this.http.get(url, this.authService.getHttpOptions()).toPromise();
    } catch (error) {
      console.error('Error fetching company listing:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }
  /**
 * Get Company Listing.
 *
 * @returns {Promise<any>}
 */
  createReferralRequest(emailId: string, data: any): Promise<any> {
    return this.http.post(API_URL + `user/${emailId}/referral/request`, data, this.authService.getHttpOptions()).toPromise();
  }

  /**
* Get Referral Count
*
* @returns {Promise<any>}
*/
  getReferralCount(emailId: string): Promise<any> {
    return this.http.get(`${API_URL}user/${emailId}/subscription/status`, this.authService.getHttpOptions()).toPromise();
  }

  /**
* GetMatching Score
*
* @returns {Promise<any>}
*/
  getReferralMatchingScore(emailId: string, referralId: string): Promise<any> {
    return this.http.get(`${API_URL}user/${emailId}/referral/${referralId}/score`, this.authService.getHttpOptions()).toPromise();
  }


  /**request New Company 
   *
* @returns {Promise<any>}
  */

  requestNewCompany(data: any): Promise<any> {
    return this.http.post(API_URL + `company/request`, data, this.authService.getHttpOptions()).toPromise();
  }

  /**Get New Company List
    *
 * @returns {Promise<any>}
   */
  getAllNewCompany(): Promise<any> {
    return this.http.get(API_URL + `company/all`, this.authService.getHttpOptions()).toPromise();
  }

  /**Get ALl job List  
    *
 * @returns {Promise<any>}
   */
  getAllJob(): Promise<any> {
    let url = `${API_URL}job?status=PUBLISHED`;
    const pageSize = 200;
    if (pageSize) {
      url += `&pageSize=${pageSize}`;
    }

    return this.http.get(url, this.authService.getHttpOptions()).toPromise();

  }

  /**Get New job List  By CompanyID
    *
 * @returns {Promise<any>}
   */
  getJobByCompanyID(companyID: any, location?: any, department?: any, softSkills?: any, coreSkills?: any, salary?: any, experience?: any, technicalSkill?: any): Promise<any> {
    let url = `${API_URL}job?status=PUBLISHED`;
    const pageSize = 200;
    if (pageSize) {
      url += `&pageSize=${pageSize}`;
    }

    if (companyID) {
      url += `&companyId=${companyID}`;

    }
    if (location) {
      url += `&location=${encodeURIComponent(location)}`
    }
    if (department) {
      url += `&department=${encodeURIComponent(department)}`
    }
    if (softSkills) {
      url += `&softSkills=${encodeURIComponent(softSkills)}`
    }
    if (coreSkills) {
      url += `&coreSkills=${encodeURIComponent(coreSkills)}`
    }
    if (salary) {
      url += `&minSalary=${salary.minSalary}`
      url += `&maxSalary=${salary.maxSalary}`

    }
    if (experience) {
      url += `&minExperience=${experience.minExperience}`
      url += `&maxExperience=${experience.maxExperience}`

    }
    if (technicalSkill) {
      url += `&technicalSkills=${encodeURIComponent(technicalSkill)}`
    }
    return this.http.get(url, this.authService.getHttpOptions()).toPromise();

  }

  /**Get New job List  By jobId
  *
* @returns {Promise<any>}
 */
  getJobByJobID(jobID: any): Promise<any> {
    let url = `${API_URL}job/${jobID}`;

    return this.http.get(url, this.authService.getHttpOptions()).toPromise();

  }

  /**Get  company detail By companyId
*
* @returns {Promise<any>}
*/
  getcompanyDetailsByCompanyID(companyID: any): Promise<any> {
    let url = `${API_URL}company/${companyID}`;

    return this.http.get(url, this.authService.getHttpOptions()).toPromise();

  }

  /**
* Candidate apply job at mini job portal
*
* @returns {Promise<any>}
*/
  applyJobByEmail(data: any): Promise<any> {
    return this.http.post(API_URL + `job-application/`, data, this.authService.getHttpOptions()).toPromise();
  }

  /**
* GetMatching Score
*
* @returns {Promise<any>}
*/
  getJobMatchingScore(jobApplicationId: string): Promise<any> {
    return this.http.get(`${API_URL}job-application/${jobApplicationId}/score`, this.authService.getHttpOptions()).toPromise();
  }

}


