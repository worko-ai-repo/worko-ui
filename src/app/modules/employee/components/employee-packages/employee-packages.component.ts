import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { PublicProfileService } from 'src/app/modules/worko/services/public-profile.service';
import { EmployeeProfileService } from '../../services/employee-profile.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { Router } from '@angular/router';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-employee-packages',
  templateUrl: './employee-packages.component.html',
  styleUrls: ['./employee-packages.component.scss']
})
export class EmployeePackagesComponent implements OnInit {
  emailAddress:any="";
  packageList:any[]=[];
  packageDetails:any={};
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  successmessage: string = "";
  successtitle: string = "";

  constructor(private publicSrv : PublicProfileService, private storage:StorageService ,private empService:EmployeeProfileService, private spinner: NgxSpinnerService, private router: Router){}

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.getPackageDetail();
    this.spinner.show();
    this.successtitle = 'Alert!';
    this.successmessage = "Well, well, well, it seems you've discovered a section that's currently under construction! But fret not, we're concocting something truly special for you. Keep your eyes peeled as we prepare to reveal how your skills can turn into golden opportunities. The countdown to your earning potential begins now!";
    setTimeout(()=> {
      this.spinner.hide();
      this.openModal(ModalType.SUCCESS_MESSAGE);
    }, 2000);
  }

  ngOnDestroy(): void {
    this.spinner.hide();
    this.closeModal();
  }

  async getPackageDetail(){
    await this.publicSrv.getPublicServices(this.emailAddress).then(async(response)=>{
      this.packageList = response;
      this.packageDetails = this.packageList[0];
    }) 
  }

  okBtn() {
    this.spinner.hide();
    this.closeModal();
    this.router.navigate(['/employee/Dashboard']);
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
