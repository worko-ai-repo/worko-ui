import { Component, OnInit } from '@angular/core';
import { CompanyListingService } from '../../services/company-listing.service';

@Component({
  selector: 'app-company-listing',
  templateUrl: './company-listing.component.html',
  styleUrls: ['./company-listing.component.scss']
})
export class CompanyListingComponent implements OnInit {
  // showDiv: boolean = false;
  // companyArray: any[] = /* ... your company array ... */;
  selectedCompany: any;
  selectedItem: any = null;
  showdiv: boolean = false;
  hidediv: boolean = true;
  isDivOpen: boolean = false;
  // compantList: any[] = [{
  //   "createdAt": "2023-11-13T18:34:56.411Z",
  //   "SK": "ID#01HF4ZE6GQ241E6RJ079TKHDCC",
  //   "PK": "COMPANY#",
  //   "name": "Google",
  //   "image": "assets/images/google.png",
  //   "updatedAt": "2023-11-13T18:34:56.411Z"
  // },
  // {
  //   "createdAt": "2023-11-13T18:35:59.006Z",
  //   "SK": "ID#01HF4ZG3MWV0SHS97397NJS9GP",
  //   "PK": "COMPANY#",
  //   "name": "Google",
  //   "image": "assets/images/google.png",
  //   "updatedAt": "2023-11-13T18:35:59.006Z"
  // },
  // {
  //   "createdAt": "2023-11-13T18:36:05.967Z",
  //   "SK": "ID#01HF4ZGAEEW93BC30FKW7MRQX3",
  //   "PK": "COMPANY#",
  //   "name": "Google",
  //   "image": "assets/images/google.png",
  //   "updatedAt": "2023-11-13T18:36:05.967Z"
  // },
  // {
  //   "createdAt": "2023-11-13T18:37:06.767Z",
  //   "SK": "ID#01HF4ZJ5TEPDFN1YGBT232V09T",
  //   "PK": "COMPANY#",
  //   "name": "Google",
  //   "image": "assets/images/google.png",
  //   "updatedAt": "2023-11-13T18:37:06.767Z"
  // },
  // {
  //   "createdAt": "2023-11-13T18:37:13.958Z",
  //   "SK": "ID#01HF4ZJCV6D0212P9DZ47KGKTE",
  //   "PK": "COMPANY#",
  //   "name": "Google",
  //   "image": "assets/images/google.png",
  //   "updatedAt": "2023-11-13T18:37:13.958Z"
  // },
  // {
  //   "createdAt": "2023-11-13T18:37:53.937Z",
  //   "SK": "ID#01HF4ZKKWGV3NCRPSFJZBYT199",
  //   "PK": "COMPANY#",
  //   "name": "Google",
  //   "image": "assets/images/google.png",
  //   "updatedAt": "2023-11-13T18:37:53.937Z"
  // },
  // {
  //   "createdAt": "2023-11-13T18:39:08.208Z",
  //   "SK": "ID#01HF4ZNWDGASTWM60JQBRWTWWA",
  //   "PK": "COMPANY#",
  //   "name": "Google",
  //   "image": "assets/images/google.png",
  //   "updatedAt": "2023-11-13T18:39:08.208Z"
  // },
  // {
  //   "teamSize": 100000,
  //   "linkedIn": "linkedIn",
  //   "updatedAt": "2023-11-14T04:10:17.376Z",
  //   "industry": "IT",
  //   "logoUrl": "logo",
  //   "createdAt": "2023-11-14T04:10:17.376Z",
  //   "SK": "ID#01HF60BPCZSNGG4CM9HC9A36KQ",
  //   "PK": "COMPANY#",
  //   "carrierPage": "carrier",
  //   "name": "Microsoft",
  //   "image": "assets/images/google.png",
  // },
  // {
  //   "teamSize": 100000,
  //   "linkedIn": "linkedIn",
  //   "updatedAt": "2023-11-14T04:10:56.174Z",
  //   "industry": "IT",
  //   "logoUrl": "logo",
  //   "createdAt": "2023-11-14T04:10:56.174Z",
  //   "SK": "ID#01HF60CW9DSV296CQQCQETHD2P",
  //   "PK": "COMPANY#",
  //   "carrierPage": "carrier",
  //   "name": "Amazon",
  //   "image": "assets/images/google.png",
  // }
  // ];
  companyList: any[] = [];
  companyObj: any = {
    "createdAt": "",
    "SK": "",
    "PK": "",
    "name": "",
    "updatedAt": ""
  }


  constructor(private companyListing: CompanyListingService) {

  }
  ngOnInit(): void {
    this.getCompanyDetails();

  }

  getCompanyDetails(){
    this.companyListing.getCompanyListing().subscribe({
        next: (response) => {
          console.log(response);
           this.companyList = response;
          // this.loading = false;
        },
        error: (error) => {
          debugger;
          console.error(error);
          // this.loading = false;
          // this.feedback = getErrorFeedback("ERROR.UNHANDLED_ERROR");
        },
        complete: () => {
          // Optionally handle the completion event
        }
      });
  }
  onMouseOver(item: any, event: any) {
    this.showdiv = true;
    this.companyObj = item;
    this.selectedItem = item;
    this.hidediv
  }

  onMouseOut(event: any) {
    this.showdiv = false;
  }
  isSelected(item: any) {
    return this.selectedItem === item;
  }
  

  toggleDiv() {
    this.isDivOpen = !this.isDivOpen;
  }
}
