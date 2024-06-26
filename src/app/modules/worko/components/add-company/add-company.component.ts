import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { CompanyListingService } from '../../services/company-listing.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})

export class AddCompanyComponent {


  @ViewChild('company')
  companyFormDirective!: NgForm;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  userLoggedIn: boolean = false;
  form!: NgForm;
  companyData: any;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  successtitle: string = "";
  successmessage: string = "";

  constructor(private cognitoService: CognitoService, private modalService: NgbModal, private companyListingService: CompanyListingService, private spinner: NgxSpinnerService) { }

  async ngOnInit(): Promise<void> {
    // debugger
    
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
  }
  companyForm = {


    CompanyName: "",
    industry: 'Industry',

    carrierPage: "",
    linkedIn: "",
    emailid: "",


  }


  async requestCampanyData(form: NgForm) {
    this.spinner.show()
    try {
      this.companyData = {
        userType: "EMP",
        companyDetail: {
          name: this.companyForm.CompanyName,
          industry: 'Industry',
          //emailid: this.companyForm.emailid,
          carrierPage: this.companyForm.carrierPage,
          linkedIn: this.companyForm.linkedIn
        }
      }

     
      await this.companyListingService.requestNewCompany(this.companyData)
      let response = await this.companyListingService.getAllNewCompany()
      if (response) {
       
        this.companyFormDirective.resetForm()
        this.spinner.hide()
        this.openModal(this.modalType.SUCCESS_MESSAGE)
      }


    } catch (error: any) {
      this.companyFormDirective.resetForm()
      if (error.status === 409) {
        this.spinner.hide()

        this.successmessage = "The company you entered is already in our referral network. Please check the listing page and try again."
        this.successtitle = "Alert"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      } else {


        this.spinner.hide()

        this.successmessage = "Something went wrong. Please try again after sometime"
        this.successtitle = "Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
      }
    }


  }
  cancel() {

    this.successmessage = "";
    this.successtitle = "";
   // window.location.reload()
    this.modal.cancel();

  }

  /**
 * Open modal.
 *
 * @param {ModalType} modalType
 * @param {string} [message = ""]
 * @param {string} [title = ""]
 * @returns {void}
 */
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {

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

