import { Component } from '@angular/core';
import { AdminService } from '../admin/services/admin.service';
import { CorporateService } from './services/corporate.service';
import { StorageService } from '../app-core/services/storage.service';


//@Todo : Move this to a common file
export interface CorporateVitalDetails { 
  cognitoUserId?: string; 
  cognitoUserGroup?: string; 
  companyId?: string; 
  corporateUserType?: string; 
  companyName?: string; 
}
@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.scss']
})
export class CorporateComponent {
  userType = "Corporate";

  // Misc Details for the user
  corporateVitelDetails: CorporateVitalDetails = {};
  CorporateDashHeading = "Corporate Dashboard" ;

  // User Details

  // Side Bar Toggle
  isSidebarExpanded: boolean = true;
  
  constructor(private adminService: AdminService,
    private CorporateService: CorporateService,
    private storage : StorageService) {
   
  }

  /**
   *  We have to use three attrb throught the applications 
   *  * cognitoUserId - Set  while login
   *  * userType (this is the CognitoGroup) - Set  while login
   *  * userDetail with companyId  - Need to set it here
   *     * companyId
   *     * corporateUserType [ADMIN ,RECURITER]
   */
  ngOnInit(): void {
    // Setting Up the default values for the user
    this.corporateVitelDetails.cognitoUserId = this.storage.get("cognitoUserId");
    this.corporateVitelDetails.cognitoUserGroup = this.storage.get("userType");
    
    this.fetchUserDetailsWithCompany(this.corporateVitelDetails.cognitoUserId!);
  }

  // Fetching the user details with company
  async fetchUserDetailsWithCompany(cognitoUserId: string){
    try{
      let userDetail = await this.CorporateService.getCorporateUserDetailById(cognitoUserId);
      
      if(userDetail){
        let companyDetails = await this.CorporateService.getCompanyDetailsById(userDetail[0]?.companyId);
        this.corporateVitelDetails.companyId = userDetail[0]?.companyId;
        this.corporateVitelDetails.corporateUserType = userDetail[0]?.corporateUserType;
        this.corporateVitelDetails.companyName = companyDetails[0]?.name;

        this.CorporateDashHeading = `${this.corporateVitelDetails.companyName} Dashboard`;
        if(this.corporateVitelDetails){
          this.CorporateService.setCorporateVitalDetails(this.corporateVitelDetails);
        }
        
      }
    }
    catch(error){
      console.error('Error fetching user details:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  } 

 /**
   * Toggle sidebar.
   *
   * @returns {void}
   */
  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
}

/**
 * @example {response Body}
 * 
 * {
    "data": [
        {
            "lastName": "asdfc",
            "inviteId": "01JEDEF3PSM5XYEW0NQ29JYVMW",
            "corporateUserType": "ADMIN",
            "firstName": "asht",
            "createdAt": "2024-12-06T09:26:47.831Z",
            "companyId": "01J6XZHP9DV2QZJ62FZ29HGTMW",
            "isDeleted": false,
            "GSI1PK": "CORP#USR#",
            "cognitoUserId": "61132daa-1091-706e-a100-a4e31be43717",
            "GSI1SK": "ID#312CPTM44HE1QA2054WCDY8DRQ",
            "SK": "CORP#USR#bsk.72544@gmail.com#ID#312CPTM44HE1QA2054WCDY8DRQ",
            "PK": "COMP#ID#01J6XZHP9DV2QZJ62FZ29HGTMW",
            "id": "312CPTM44HE1QA2054WCDY8DRQ",
            "email": "bsk.72544@gmail.com",
            "updatedAt": "2024-12-06T09:26:47.831Z",
            "companyDetails": {
                "isVerified": true,
                "industry": "food & beverages",
                "linkedIn": "https://www.linkedin.com/company/pepsico",
                "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Pepsi_logo_2014.svg",
                "createdAt": "2024-09-04T07:38:53.615Z",
                "GSI1PK": "COMP#INDS#food & beverages",
                "teamSize": 291000,
                "GSI1SK": "ID#01J6XZHP9DV2QZJ62FZ29HGTMW",
                "SK": "ID#01J6XZHP9DV2QZJ62FZ29HGTMW",
                "name": "PEPSICO",
                "logo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAABhElEQVQ4y2NgoBAwAixh/f/z5ccAEB+BA8vNJdAP1zyGBAwaAYnFSxcC9ZPGsPIH6e7kcoHB7a1r+/+E3aw7aQGfA3C9GHLgcBFMBwGxCHtHUYWaBUkTSgIEXBFA0zIXxwNlEtXHADGyO//+ICX3tM7vD2I0/AuItAAEnb7W06OjANvGBFIMuR9U4jAxBCYEEaxkcT0jM0QYhHk/gvkTnMDI88oz09ikIgHHMBEwgfUAhQA5pYUEOAAGUyFLDY1b0AClVBDKZ1HygJXQwE4gfhh7MGgUBMH7a0FehG8HBDaAIYAPg7YlzkNH4gAAAAASUVORK5CYII=",
                "PK": "COMP#",
                "id": "01J6XZHP9DV2QZJ62FZ29HGTMW",
                "carrierPage": "https://www.pepsicojobs.com",
                "updatedAt": "2024-09-04T07:38:53.615Z"
            }
        }
    ],
    "pagination": {
        "count": 1,
        "pageSize": 25,
        "sortOrder": "descending",
        "timesQueried": 1,
        "queriedCount": 0
    }
}
 */