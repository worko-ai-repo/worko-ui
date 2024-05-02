import { Component, ViewChild } from '@angular/core';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { CompanyListingService } from '../../services/company-listing.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})

export class AddCompanyComponent {

  @ViewChild(ModalComponent) modal!: ModalComponent;
  userLoggedIn: boolean = false;
form: any;
companyData:any;
modalType = ModalType;
modalMessage: string = "";
modalTitle: string = "";
showModal: ModalType | undefined;
  successtitle: string="";
  successmessage: string="";

  constructor(private cognitoService: CognitoService,private companyListingService:CompanyListingService,private spinner:NgxSpinnerService){}

  async ngOnInit(): Promise<void> {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
  }
companyForm={


  CompanyName: "",
    industry: 'Industry',
   
    carrierPage:"",
    linkedIn: "",
    emailid:"",


}


  async requestCampanyData(form:any){
    this.spinner.show()
    try{
  this.companyData={
    userType: "EMP",
    companyDetail: {
      name: this.companyForm.CompanyName,
      industry: 'Industry',
      //emailid: this.companyForm.emailid,
      carrierPage: this.companyForm.carrierPage,
      linkedIn: this.companyForm.linkedIn
    }
  }

console.log(this.companyData)
 await this.companyListingService.requestNewCompany(this.companyData)
 let response=await this.companyListingService.getAllNewCompany()
 if(response){
  console.log(response)
  this.spinner.hide()
  this.openModal(this.modalType.SUCCESS_MESSAGE)
 }

 
    }catch(error){
      this.spinner.hide()
      this.successmessage="Something went wrong. Please try again after sometime"
      this.successtitle="Error"
      this.openModal(ModalType.SUCCESS_MESSAGE)
    }

  
  }
cancel(){
  this.modal.cancel()
}

    /**
   * Open modal.
   *
   * @param {ModalType} modalType
   * @param {string} [message = ""]
   * @param {string} [title = ""]
   * @returns {void}
   */
    openModal(modalType: ModalType, message: string ="", title: string="" ): void {

      this.showModal = modalType;
      this.modalMessage = message;
      this.modalTitle = title;
      this.modal.open();
    }
      /**
     * Close modal.
     *
     * @returns {void}
     */
      closeModal(): void {
        this.modal.cancel();
      }
  
  
  }

