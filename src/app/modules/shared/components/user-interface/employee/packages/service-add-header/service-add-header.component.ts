import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { EmployeeProfileService } from 'src/app/modules/employee/services/employee-profile.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-service-add-header',
  templateUrl: './service-add-header.component.html',
  styleUrls: ['./service-add-header.component.scss']
})
export class ServiceAddHeaderComponent {
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  mondayStartTime: string = ''; // Variable to store the selected start time from Monday
  mondayEndTime: string = ''; // Variable to store the selected end time from Monday
  availabilityList:any[]=[];
  availabilityDetails:any={};
  emailAddress:any="";
  availabilityData = [
    { day: 'Monday', available: true, timings: [{ startTime: '12:00 PM', endTime: '12:00 PM' }, { startTime: '12:15 PM', endTime: '12:15 PM' }, { startTime: '12:30 PM', endTime: '12:30 PM' }, { startTime: '12:45 PM', endTime: '12:45 PM' }, { startTime: '1:00 PM', endTime: '1:00 PM' }, { startTime: '1:15 PM', endTime: '1:15 PM' }], checkboxClicked: false, selectedStartTime: '', selectedEndTime: '' },
    { day: 'Tuesday', available: false, timings: [{ startTime: '12:00 PM', endTime: '12:00 PM' }, { startTime: '12:15 PM', endTime: '12:15 PM' }, { startTime: '12:30 PM', endTime: '12:30 PM' }, { startTime: '12:45 PM', endTime: '12:45 PM' }, { startTime: '1:00 PM', endTime: '1:00 PM' }, { startTime: '1:15 PM', endTime: '1:15 PM' }], checkboxClicked: false, selectedStartTime: '', selectedEndTime: '' },
    { day: 'Wednesday', available: true, timings: [{ startTime: '12:00 PM', endTime: '12:00 PM' }, { startTime: '12:15 PM', endTime: '12:15 PM' }, { startTime: '12:30 PM', endTime: '12:30 PM' }, { startTime: '12:45 PM', endTime: '12:45 PM' }, { startTime: '1:00 PM', endTime: '1:00 PM' }, { startTime: '1:15 PM', endTime: '1:15 PM' }], checkboxClicked: false, selectedStartTime: '', selectedEndTime: '' },
    { day: 'Thursday', available: true, timings: [{ startTime: '12:00 PM', endTime: '12:00 PM' }, { startTime: '12:15 PM', endTime: '12:15 PM' }, { startTime: '12:30 PM', endTime: '12:30 PM' }, { startTime: '12:45 PM', endTime: '12:45 PM' }, { startTime: '1:00 PM', endTime: '1:00 PM' }, { startTime: '1:15 PM', endTime: '1:15 PM' }], checkboxClicked: false, selectedStartTime: '', selectedEndTime: '' },
    { day: 'Friday', available: true, timings: [{ startTime: '12:00 PM', endTime: '12:00 PM' }, { startTime: '12:15 PM', endTime: '12:15 PM' }, { startTime: '12:30 PM', endTime: '12:30 PM' }, { startTime: '12:45 PM', endTime: '12:45 PM' }, { startTime: '1:00 PM', endTime: '1:00 PM' }, { startTime: '1:15 PM', endTime: '1:15 PM' }], checkboxClicked: false, selectedStartTime: '', selectedEndTime: '' },
    { day: 'Saturday', available: true, timings: [{ startTime: '12:00 PM', endTime: '12:00 PM' }, { startTime: '12:15 PM', endTime: '12:15 PM' }, { startTime: '12:30 PM', endTime: '12:30 PM' }, { startTime: '12:45 PM', endTime: '12:45 PM' }, { startTime: '1:00 PM', endTime: '1:00 PM' }, { startTime: '1:15 PM', endTime: '1:15 PM' }], checkboxClicked: false, selectedStartTime: '', selectedEndTime: '' },
    { day: 'Sunday', available: true, timings: [{ startTime: '12:00 PM', endTime: '12:00 PM' }, { startTime: '12:15 PM', endTime: '12:15 PM' }, { startTime: '12:30 PM', endTime: '12:30 PM' }, { startTime: '12:45 PM', endTime: '12:45 PM' }, { startTime: '1:00 PM', endTime: '1:00 PM' }, { startTime: '1:15 PM', endTime: '1:15 PM' }], checkboxClicked: false, selectedStartTime: '', selectedEndTime: '' }
  ];


  timingOptions = [
    { startTime: '12:00 AM', endTime: '12:00 AM' },
    { startTime: '12:15 AM', endTime: '12:15 AM' },
    { startTime: '12:30 AM', endTime: '12:30 AM' },
    { startTime: '12:45 AM', endTime: '12:45 AM' },
    { startTime: '1:00 AM', endTime: '1:00 AM' },
    { startTime: '1:15 AM', endTime: '1:15 AM' },
    { startTime: '1:30 AM', endTime: '1:30 AM' },
    { startTime: '1:45 AM', endTime: '1:45 AM' },
    { startTime: '2:00 AM', endTime: '2:00 AM' },
    { startTime: '2:15 AM', endTime: '2:15 AM' },
    { startTime: '2:30 AM', endTime: '2:30 AM' },
    { startTime: '2:45 AM', endTime: '2:45 AM' },
    { startTime: '3:00 AM', endTime: '3:00 AM' },
    { startTime: '3:15 AM', endTime: '3:15 AM' },
    { startTime: '3:30 AM', endTime: '3:30 AM' },
    { startTime: '3:45 AM', endTime: '3:45 AM' },
    { startTime: '4:00 AM', endTime: '4:00 AM' },
    { startTime: '4:15 AM', endTime: '4:15 AM' },
    { startTime: '4:30 AM', endTime: '4:30 AM' },
    { startTime: '4:45 AM', endTime: '4:45 AM' },
    { startTime: '5:00 AM', endTime: '5:00 AM' },
    { startTime: '5:15 AM', endTime: '5:15 AM' },
    { startTime: '5:30 AM', endTime: '5:30 AM' },
    { startTime: '5:45 AM', endTime: '5:45 AM' },
    { startTime: '6:00 AM', endTime: '6:00 AM' },
    { startTime: '6:15 AM', endTime: '6:15 AM' },
    { startTime: '6:30 AM', endTime: '6:30 AM' },
    { startTime: '6:45 AM', endTime: '6:45 AM' },
    { startTime: '7:00 AM', endTime: '7:00 AM' },
    { startTime: '7:15 AM', endTime: '7:15 AM' },
    { startTime: '7:30 AM', endTime: '7:30 AM' },
    { startTime: '7:45 AM', endTime: '7:45 AM' },
    { startTime: '8:00 AM', endTime: '8:00 AM' },
    { startTime: '8:15 AM', endTime: '8:15 AM' },
    { startTime: '8:30 AM', endTime: '8:30 AM' },
    { startTime: '8:45 AM', endTime: '8:45 AM' },
    { startTime: '9:00 AM', endTime: '9:00 AM' },
    { startTime: '9:15 AM', endTime: '9:15 AM' },
    { startTime: '9:30 AM', endTime: '9:30 AM' },
    { startTime: '9:45 AM', endTime: '9:45 AM' },
    { startTime: '10:00 AM', endTime: '10:00 AM' },
    { startTime: '10:15 AM', endTime: '10:15 AM' },
    { startTime: '10:30 AM', endTime: '10:30 AM' },
    { startTime: '10:45 AM', endTime: '10:45 AM' },
    { startTime: '11:00 AM', endTime: '11:00 AM' },
    { startTime: '11:15 AM', endTime: '11:15 AM' },
    { startTime: '11:30 AM', endTime: '11:30 AM' },
    { startTime: '11:45 AM', endTime: '11:45 AM' },
    { startTime: '12:00 PM', endTime: '12:00 PM' },
    
    { startTime: '12:15 PM', endTime: '12:15 PM' },
    { startTime: '12:30 PM', endTime: '12:30 PM' },
    { startTime: '12:45 PM', endTime: '12:45 PM' },
    { startTime: '1:00 PM', endTime: '1:00 PM' },
    { startTime: '1:15 PM', endTime: '1:15 PM' },
    { startTime: '1:30 PM', endTime: '1:30 PM' },
    { startTime: '1:45 PM', endTime: '1:45 PM' },
    { startTime: '2:00 PM', endTime: '2:00 PM' },
    { startTime: '2:15 PM', endTime: '2:15 PM' },
    { startTime: '2:30 PM', endTime: '2:30 PM' },
    { startTime: '2:45 PM', endTime: '2:45 PM' },
    { startTime: '3:00 PM', endTime: '3:00 PM' },
    { startTime: '3:15 PM', endTime: '3:15 PM' },
    { startTime: '3:30 PM', endTime: '3:30 PM' },
    { startTime: '3:45 PM', endTime: '3:45 PM' },
    { startTime: '4:00 PM', endTime: '4:00 PM' },
    { startTime: '4:15 PM', endTime: '4:15 PM' },
    { startTime: '4:30 PM', endTime: '4:30 PM' },
    { startTime: '4:45 PM', endTime: '4:45 PM' },
    { startTime: '5:00 PM', endTime: '5:00 PM' },
    { startTime: '5:15 PM', endTime: '5:15 PM' },
    { startTime: '5:30 PM', endTime: '5:30 PM' },
    { startTime: '5:45 PM', endTime: '5:45 PM' },
    { startTime: '6:00 PM', endTime: '6:00 PM' },
    { startTime: '6:15 PM', endTime: '6:15 PM' },
    { startTime: '6:30 PM', endTime: '6:30 PM' },
    { startTime: '6:45 PM', endTime: '6:45 PM' },
    { startTime: '7:00 PM', endTime: '7:00 PM' },
    { startTime: '7:15 PM', endTime: '7:15 PM' },
    { startTime: '7:30 PM', endTime: '7:30 PM' },
    { startTime: '7:45 PM', endTime: '7:45 PM' },
    { startTime: '8:00 PM', endTime: '8:00 PM' },
    { startTime: '8:15 PM', endTime: '8:15 PM' },
    { startTime: '8:30 PM', endTime: '8:30 PM' },
    { startTime: '8:45 PM', endTime: '8:45 PM' },
    { startTime: '9:00 PM', endTime: '9:00 PM' },
    { startTime: '9:15 PM', endTime: '9:15 PM' },
    { startTime: '9:30 PM', endTime: '9:30 PM' },
    { startTime: '9:45 PM', endTime: '9:45 PM' },
    { startTime: '10:00 PM', endTime: '10:00 PM' },
    { startTime: '10:15 PM', endTime: '10:15 PM' },
    { startTime: '10:30 PM', endTime: '10:30 PM' },
    { startTime: '10:45 PM', endTime: '10:45 PM' },
    { startTime: '11:00 PM', endTime: '11:00 PM' },
    { startTime: '11:15 PM', endTime: '11:15 PM' },
    { startTime: '11:30 PM', endTime: '11:30 PM' },
    { startTime: '11:45 PM', endTime: '11:45 PM' },
  ];
  

  
  

  selectForm: FormGroup;
  selectOptions!: FormArray;
  selectForms: FormGroup[] = [];
  constructor(private formBuilder: FormBuilder,private empService:EmployeeProfileService) {
    this.selectForm = this.formBuilder.group({
      startTime: ['', Validators.required],
      endTime: ['', [Validators.required, this.endTimeValidator]]
    });
  }

  ngOnInit(): void {
    this.availabilityData.forEach(() => {
      const selectForm = this.formBuilder.group({
        selectOptions: this.formBuilder.array([this.createSelectOption()])
      });
      selectForm.disable(); // Initially disable the form group
      const selectOptionsArray = selectForm.get('selectOptions') as FormArray;
      selectOptionsArray.controls.forEach((control: AbstractControl) => {
        const group = control as FormGroup;
        group.get('endTime')?.setValidators([Validators.required, this.endTimeValidator]);
        group.get('endTime')?.updateValueAndValidity(); // Trigger validation
      });
      this.selectForms.push(selectForm);
    });

    this.getChooseAvailabilitys();
  }
d:any;
  async getChooseAvailabilitys(){
    await this.empService.getChooseAvailability(this.emailAddress).then(async(response)=>{
      this.availabilityList = response;
      this.availabilityDetails = this.availabilityList[0];
      console.log(this.availabilityList,'zuber data')
      this.d=this.availabilityList[0]?.availability;
      
    })
  }

  applyTimeToAll(): void {
    const mondaySelectOptions = this.getSelectOptionsFormArray(0).controls;
    for (let i = 1; i < this.availabilityList[0]?.availability.length; i++) {
      const availabilityData = this.availabilityList[0]?.availability[i];
      
      if (availabilityData.checkboxClicked) {
        const selectOptionsArray = this.getSelectOptionsFormArray(i);
        selectOptionsArray.clear();
        for (const option of mondaySelectOptions) {
          selectOptionsArray.push(this.formBuilder.group({
            startTime: [option.get('startTime')?.value],
            endTime: [option.get('endTime')?.value]
          }));
        }
      }
    }
}






updateSelectFormControls(index: number, startTime: string, endTime: string): void {
    const selectFormArray = this.selectForms[index].get('selectOptions') as FormArray;
    selectFormArray.controls.forEach((control: AbstractControl) => {
        control.get('startTime')?.setValue(startTime);
        control.get('endTime')?.setValue(endTime);
    });
}



  






  createSelectOption() {
    return this.formBuilder.group({
      startTime: [''],
      endTime: ['']
    });
  }

  getSelectOptionsFormArray(dayIndex: number): FormArray {
    return this.selectForms[dayIndex].get('selectOptions') as FormArray;
  }

  // addSelectOption(dayIndex: number): void {
  //   const selectOptions = this.getSelectOptionsFormArray(dayIndex);
  //   selectOptions.push(this.createSelectOption());
  // }

  addSelectOption(dayIndex: number): void {
    const selectOptions = this.getSelectOptionsFormArray(dayIndex);
    selectOptions.push(this.createSelectOption());

    // Update validators for the newly added fields
    const newFieldIndex = selectOptions.length - 1;
    const newField = selectOptions.at(newFieldIndex);
    newField?.get('endTime')?.setValidators([Validators.required, this.endTimeValidator]);
    newField?.get('endTime')?.updateValueAndValidity();
  }


  removeSelectOption(dayIndex: number, optionIndex: number): void {
    const selectOptions = this.getSelectOptionsFormArray(dayIndex);
    selectOptions.removeAt(optionIndex);
  }

  // Custom validator function to check if end time is the same as start time
  private endTimeValidator(control: AbstractControl): ValidationErrors | null {
    const startTime = control.parent?.get('startTime')?.value;
    const endTime = control.value;
    if (startTime === endTime) {
      return { endTimeSameAsStartTime: true };
    }
    return { endTimeSameAsStartTime: false };
  }


  toggleCheckbox(index: number): void {
    const formGroup = this.selectForms[index];
    const checkboxClicked = this.availabilityData[index].checkboxClicked;

    if (checkboxClicked) {
      formGroup.disable();
    } else {
      formGroup.enable();
    }
  }


  isAddButtonVisible(day: any): boolean {
    return day.dayEnabled;
  }

   convertIsoToTime(isoDate:any) {
    const date = new Date(isoDate);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    const formattedTime = `${hours}:${String(minutes).padStart(2, '0')} ${period}`;
    return formattedTime;
}



  serviceAdd() {
    this.openModal(ModalType.EMPLOYEE_SERVICE_ADD);
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
    // this.referrralComponent.showReferrelRow = true;
    this.modal.cancel();

  }










}
