import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';

@Component({
  selector: 'app-employee-referral-details',
  templateUrl: './employee-referral-details.component.html',
  styleUrls: ['./employee-referral-details.component.scss']
})
export class EmployeeReferralDetailsComponent implements OnChanges {
  @Input() empdetailsList: any = "";
  @Input() empEducationList: any = "";
  @Input() empExperienceList: any = "";
  @Input() empCoreSkillsList: any = "";
  @Input() empAchievmentsList: any = "";
  @Input() empDetails: any = {};
  @Input() empEducationDetails: any = {};
  @Input() empAchievmentsDetails: any = {};
  @Input() empCoreSkillsDetails: any = {};
  @Input() empExperienceDetails: any = {};
  @Input() selectedStatus: any;
  @Input() selectedReferral:any;
  @Output() onAccept = new EventEmitter<any>();
  @Output() onReject = new EventEmitter<any>();
  showCard: boolean = false;
  action:string = "";
  profileImage: any;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  score: number =  4;
  originalPoints = 2.1;
  possiblePoints = 10;
  

  // selectedStatus!: string; 

  //   // ...

  //   onStatusSelected(status: string): void {
  //       this.selectedStatus = status;
  //   }

  acceptBtn() {
    // Handling the accept logic here
    this.action = "accept";
    this.openModal(ModalType.CONFIRMATION_DIALOG);
    console.log('Accepted');
  }

  rejectBtn(): void {
    this.openModal(ModalType.REJECTED_REQUEST);
    this.showCard = !this.showCard;
  }

  onLeave(): void {
    // Handle the leave logic
    console.log('Leave');
  }

  ngOnChanges(): void {
    console.log(this.empExperienceList[0]?.department);
    console.log(this.empdetailsList[0]?.CTC);
    console.log(this.empdetailsList[0]?.noticePeriod);
    console.log(this.empdetailsList[0]?.ECTC);
    console.log(this.empCoreSkillsDetails[0]?.coreSkills);
    console.log(this.empCoreSkillsDetails[0]?.certifications);
    console.log(this.selectedReferral);
    console.log(this.selectedStatus);

    if (this.empdetailsList?.length > 0) {

      this.profileImage = this.empdetailsList[0].profileImageAwsS3SignedUrl ? this.empdetailsList[0]?.profileImageAwsS3SignedUrl : '/assets/public/candidate-img.png'

    }

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

  receiveDataFromChild(data:any) {
    this.closeModal();
    this.onReject.emit(data);
  }

  acceptRequest() {
    this.closeModal();
    this.action = "";
    this.onAccept.emit();
  }

  openfile(event: { preventDefault: () => void; }){
    event.preventDefault(); 
  // console.log(this.docResult.awsS3SignedUrl)
   
   
    //window.open(this.docResult.awsS3SignedUrl,'_blank')
    window.open(this.empdetailsList[0]?.cvAwsS3SignedUrl,'_blank');
  }

  viewDetails() {
    this.openModal(ModalType.DETAILED_ANALYSIS);
  }

}
