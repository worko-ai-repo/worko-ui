import { Component, Input, ViewChild } from '@angular/core';
import { ModalComponent } from '../../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';


@Component({
  selector: 'app-package-form',
  templateUrl: './package-form.component.html',
  styleUrls: ['./package-form.component.scss']
})
export class PackageFormComponent {
  @Input()packageList:any=[]=[];
  @Input() packageDetails:any={};
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;


 exampleHeader = "";

 editPackage(){
  this.openModal(ModalType.EMPLOYEE_PACKAGE_FORM);
  
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


