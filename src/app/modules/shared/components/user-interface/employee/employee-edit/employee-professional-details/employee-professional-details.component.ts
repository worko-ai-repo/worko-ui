import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/worko/services/auth.service';
import { ModalComponent } from '../../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
@Component({
  selector: 'app-employee-professional-details',
  templateUrl: './employee-professional-details.component.html',
  styleUrls: ['./employee-professional-details.component.scss']
})
export class EmployeeProfessionalDetailsComponent {

  @ViewChild('autoCompleteInput', { static: false, read: MatAutocompleteTrigger }) trigger!: MatAutocompleteTrigger;
  @ViewChild(ModalComponent) modal!: ModalComponent;

  @Output() nextStep = new EventEmitter<void>();
  @Output() nextStepThird = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();

  myControl = new FormControl<any>('');
  //myJobControl1 = new FormControl<any>('');
  //Form3:FormGroup =new FormGroup<any>('');
  // Form1:FormGroup | undefined;
  
  @Input() workExperienceDetails: any
  @Input() employeeProfessionalData: any = {
    companyName: "",
    department: "",
    designation: "",
    workingSince: "",
    officialEmail: "",
    companySk: "",
    previousCompanies: "",
    isEmailVerified: false,

  }
  form: any;
  filteredOptions!: Observable<any[]>;
  filteredOption!: Observable<any[]>;
  companyName: string = "";
  companySK: string = "";
  subscription: Subscription = new Subscription();
  selectedCompany: any;
  PreviousCompanyName: string = "";
  previousExpYear: string = "";
  previousDesignation: string = "";
  fields: { previousCompanyName: string, previousDesignation: string, previousExperience: string }[] = [];
  // Property to store the values entered in the fields
  savedValues: { previousCompanyName: string, previousDesignation: string, previousExperience: string }[] = [];
  perviousjobs: { previousCompanyName: string, previousDesignation: string, previousExperience: string }[] = [];
  
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  selectedCompanyName: string = "";
  data: any | undefined;
 Form1:any; 
  constructor(private authService: AuthService,private fb:FormBuilder) {
     }
    
//  Form1=new FormGroup({
//   perviousjob:new FormGroup({
//     PreviousCompanyName:new FormControl(''),
//     previousDesignation:new FormControl(''),
//     previousExpYear:new FormControl(''),
//   })
//  });

  ngOnInit() {
    console.log(this.employeeProfessionalData)
    //  this.selectedCompanyName=this.employeeProfessionalData.companyName;

    // console.log(this.selectedCompanyName)
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: any) => {
        console.log(value)
        if (value && value.length >= 1) {
          return this.authService.getCompanyName(value);

        } else {
          // If value.length is less than 1, return an empty array or null
          return [];
        }
      })

    );
  //  this. Form1=this.fb.group
  //   ({
  //     perviousjob:this.fb.array([
  //       this.addPastFormGroup()
  //     ])
  
  
  //   });
      
   }

  // addPastFormGroup():FormGroup{
  //   return this.fb.group({
  //     PreviousCompanyName:["job"],
  //     previousDesignation:["job"],
  //     previousExpYear:["job"]})
  // }

  // logValidation(group:FormGroup=this.Form1):void{
  //   Object.keys(group.controls).forEach(key:String)=>{
  //     const abstractControl=group.get(key);
  //   }
  //   this.formErrors[key]="";

  // }
 
  // get perviousjob(){

  //   return this.Form1.controls["perviousjob"] as FormArray;
  // }
 
  // addField(){
  //  (<FormArray> this.Form1.get('perviousjob')).push(this.addPastFormGroup());
    


  // }
  // removeField(index: number) {
  //   this.perviousjob.removeAt(index);

  // }

 
  addField() {
    if (this.fields.length < 6) {
      this.fields.push({ previousCompanyName: '', previousDesignation: '', previousExperience: '' });
    }
  }
  // Method to check if all previous fields are filled
  areAllPreviousFieldsFilled(): boolean {
    return this.fields.every(field => field.previousCompanyName.trim() !== '' && field.previousDesignation.trim() !== '' && field.previousExperience.trim() !== '' && /^[0-9]+$/.test(field.previousExperience.trim()));
  }

  removeField(index: number) {
    this.fields.splice(index, 1);
  }


  onOptionSelected(event: any): void {
    console.log("on optionselect")


    this.selectedCompany = event.option.value;

  }
  onSelectedPastJob(event: any):void{
    this.selectedCompany = event.option.value;
  }


  displayFn(option: any): string {
    console.log(option)
    if (typeof option === 'string') {

      //   this.companyName = option;
      // this.companySK ="";
      return option;
    } else if (typeof option === 'object' && option.name) {

      this.companyName = option.name;
      this.companySK = option.SK;
      return option.name;
    } else {
      
      return '';
    }
  }
  displayPastFn(job:any): string{
    if (typeof job === 'string') {
     
      //   this.companyName = option;
      // this.companySK ="";
        return job;
      } else if (typeof job === 'object' && job.name) {
       
        this.companyName = job.name;
        this.companySK = job.SK; 
        return job.name;
      } else {
        
        return '';
      }
  }

  isValue: boolean = true;
  ngOnChanges(): void {
    if (this.employeeProfessionalData && this.employeeProfessionalData.companyName && this.employeeProfessionalData.department && this.employeeProfessionalData.designation) {
      this.fields = this.employeeProfessionalData.previousCompanies;
      if (this.employeeProfessionalData && this.employeeProfessionalData.previousCompanies.length == 0) {
        this.addField();

        debugger;
      }
    } else {
      this.getData();
      if (this.employeeProfessionalData && this.employeeProfessionalData.previousCompanies.length == 0) {
        this.addField();
      }
    }
  }

  getData() {
    this.employeeProfessionalData = {
      companyName: this.workExperienceDetails?.companyName,
      department: this.workExperienceDetails?.department,
      designation: this.workExperienceDetails?.designation,
      workingSince: this.workExperienceDetails?.experienceInMonths,
      officialEmail: this.workExperienceDetails?.emailId ? this.workExperienceDetails?.emailId : "",
      companySK: this.selectedCompany?.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.SK,
      previousCompanies: "",
      isEmailVerified: false,

    }
  }

  //Method for next step
  updateProfessionalDetails() {
    const nonBlankFields = this.fields.filter(field => field.previousCompanyName.trim() !== '' || field.previousDesignation.trim() !== '' || field.previousExperience.trim() !== '' );
    // const isCurrent=false
    // Save the non-blank fields
    this.savedValues = [...nonBlankFields];
    this.employeeProfessionalData.previousCompanies = this.savedValues;
    console.log()
    if (this.employeeProfessionalData.companyName === this.workExperienceDetails.companyName && this.employeeProfessionalData.companySK === this.workExperienceDetails.SK) {

      this.employeeProfessionalData.companyName = this.workExperienceDetails.companyName;
      this.employeeProfessionalData.companySK = this.workExperienceDetails.SK;
    } else {
      this.employeeProfessionalData.companyName = this.selectedCompany.name ? this.selectedCompany?.name : this.workExperienceDetails?.companyName
      this.employeeProfessionalData.companySK = this.selectedCompany.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.SK
    }
    this.nextStepThird.emit(this.employeeProfessionalData);
  }

  createEmployeeOfficial(form: any) {
    const nonBlankFields = this.fields.filter(field => field.previousCompanyName.trim() !== '' || field.previousDesignation.trim() !== '' || field.previousExperience.trim() !== '');
    // console.log(this.savedValues)
    // Save the non-blank fields
    this.savedValues = [...nonBlankFields];
    this.employeeProfessionalData.previousCompanies = this.savedValues;
    this.employeeProfessionalData.companyName = this.selectedCompany.name ? this.selectedCompany?.name : this.workExperienceDetails?.companyName
    this.employeeProfessionalData.companySK = this.selectedCompany.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.SK
    this.nextStepThird.emit(this.employeeProfessionalData);
    console.log(this.savedValues)
  }

  onPreviousClick() {
    const nonBlankFields = this.fields.filter(field => field.previousCompanyName.trim() !== '' || field.previousDesignation.trim() !== '' || field.previousExperience.trim() !== '');

    // Save the non-blank fields
    this.savedValues = [...nonBlankFields];
    this.employeeProfessionalData.previousCompanies = this.savedValues;
    this.employeeProfessionalData.companyName = this.selectedCompany?.name ? this.selectedCompany?.name : this.workExperienceDetails?.companyName
    this.employeeProfessionalData.companySK = this.selectedCompany?.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.SK
    this.previousStep.emit();
  }

  openOtpModal() {
    this.openModal(ModalType.OTP_VERIFICATION);
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

  receiveDataFromChild(data: any) {
    this.modal.cancel();
  }
}
