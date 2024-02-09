import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';


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
  constructor(private formBuilder: FormBuilder) {
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
  }



  applyTimeToAll(): void {
    // Get the start and end times of Monday
    const mondaySelectOptions = this.getSelectOptionsFormArray(0).controls;
    const mondayStartTime = mondaySelectOptions[0].get('startTime')?.value;
    const mondayEndTime = mondaySelectOptions[0].get('endTime')?.value;

    // Iterate through each day's time slots starting from Tuesday (index 1)
    for (let i = 1; i < this.availabilityData.length; i++) {
      const day = this.availabilityData[i];
      const selectOptionsArray = this.getSelectOptionsFormArray(i);

      // Remove existing time slots and add the time slots from Monday
      selectOptionsArray.clear();
      for (const option of mondaySelectOptions) {
        selectOptionsArray.push(this.formBuilder.group({
          startTime: [option.get('startTime')?.value],
          endTime: [option.get('endTime')?.value]
        }));
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
    return day.available;
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
