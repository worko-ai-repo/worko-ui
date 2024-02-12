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

  async getChooseAvailabilitys(){
    await this.empService.getChooseAvailability(this.emailAddress).then(async(response)=>{
      this.availabilityList = response;
      this.availabilityDetails = this.availabilityList[0];
      console.log(this.availabilityList,'zuber data')
    })
  }

  applyTimeToAll(): void {
    // Find Monday's times
    const monday = this.availabilityList[0].availability.find((day: any) => day.day === 'Monday');
    
    if (!monday || !monday.times || monday.times.length === 0) {
      return; // Handle the case where Monday has no times
    }
    
    // Extract the user's selection for Monday
    const mondaySelectedTimes = monday.times.filter((time: any) => time.startTime && time.endTime);
    const numMondayTimes = mondaySelectedTimes.length;
    
    // Get the total number of enabled days excluding Monday
    const numEnabledDays = this.availabilityList[0].availability.filter((day: any) => day.dayEnabled && day.day !== 'Monday').length;
    
    // Iterate through each day starting from Tuesday
    let mondayIndex = 0; // Track the index of Monday's selected times
    for (let i = 0; i < this.availabilityList[0].availability.length; i++) {
      const day = this.availabilityList[0].availability[i];
      if (day.dayEnabled && day.day !== 'Monday') {
        // Apply Monday's selected times to other days equally
        if (numMondayTimes > 0) {
          // Calculate the index of Monday's selected times to be applied to this day
          const index = mondayIndex % numMondayTimes;
          day.times = [{ startTime: mondaySelectedTimes[index].startTime, endTime: mondaySelectedTimes[index].endTime }];
          mondayIndex++; // Move to the next index for the next day
        } else {
          // If no specific times were selected for Monday, copy all available times
          day.times = monday.times.map((time: any) => ({ startTime: time.startTime, endTime: time.endTime }));
        }
    
        // Update the selected time for the current day's form controls
        const selectFormArray = this.selectForms[i].get('selectOptions') as FormArray;
        selectFormArray.controls.forEach((control: AbstractControl, index: number) => {
          control.get('startTime')?.setValue(day.times[0].startTime);
          control.get('endTime')?.setValue(day.times[0].endTime);
        });
      }
    }
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
