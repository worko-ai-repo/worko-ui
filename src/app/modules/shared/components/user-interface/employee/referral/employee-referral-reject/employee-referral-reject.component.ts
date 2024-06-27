import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalComponent } from '../../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-employee-referral-reject',
  templateUrl: './employee-referral-reject.component.html',
  styleUrls: ['./employee-referral-reject.component.scss']
})
export class EmployeeReferralRejectComponent implements OnInit {

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
  @Input() selectedReferral: any;
  @Output() onAccept = new EventEmitter<any>();
  @Output() onReject = new EventEmitter<any>();
  showCard: boolean = false;
  action: string = "";
  profileImage: any;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  userId: any;
  rejectedReasons: any;
  showModal: ModalType | undefined;

  constructor(private storage: StorageService) { }

  ngOnInit(): void {
    this.userId = this.storage.get("userId");
  }


  acceptBtn() {
    // Handling the accept logic here
    this.action = "accept";
    this.openModal(ModalType.CONFIRMATION_DIALOG);
    
  }

  rejectBtn(): void {
    this.openModal(ModalType.REJECTED_REQUEST);
    this.showCard = !this.showCard;
  }

  onLeave(): void {
    // Handle the leave logic
   
  }

  showMore() {
    this.openModal(ModalType.REJECT_DETAILS);
  }

  ngOnChanges(): void {
  

    if(this.selectedReferral?.rejectedByUserIds){
      this.getRejectDetailsValue();
    }

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

  getRejectDetailsValue() {
    this.selectedReferral?.rejectedByUserIds.forEach((elem: any) => {
      if (this.userId === elem.userId) {
        this.rejectedReasons = {
          reason: elem?.reason,
          comment: elem?.userComment
        }
      }
    });
  }

  receiveDataFromChild(data: any) {
    this.closeModal();
    this.onReject.emit(data);
  }

  acceptRequest() {
    this.closeModal();
    this.action = "";
    this.onAccept.emit();
  }

  openfile(event: { preventDefault: () => void; }) {
    event.preventDefault();
    // console.log(this.docResult.awsS3SignedUrl)


    //window.open(this.docResult.awsS3SignedUrl,'_blank')
    window.open(this.empdetailsList[0]?.cvAwsS3SignedUrl, '_blank')

  }

  leaveComment() {
    
  }

}
