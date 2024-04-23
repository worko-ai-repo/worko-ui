import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/worko/services/auth.service';
import { ModalComponent } from '../../../../modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { CandidateProfileService } from 'src/app/modules/candidate/services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { Router } from '@angular/router';
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

  fieldGroup1:any;
  myControl = new FormControl<any>('');
  //myJobControl1 = new FormControl<any>('');
  //Form3:FormGroup =new FormGroup<any>('');
  // Form1:FormGroup | undefined;
  @Input() workExperienceDetailsList: any
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
  emailid:string=""
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
  //fields: { previousCompanyName: string, previousDesignation: string, previousExperience: string }[] = [];
  // Property to store the values entered in the fields
  savedValues: { previousCompanyName: string, previousDesignation: string, previousExperience: string }[] = [];
  perviousjobs: [] = [];
  
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  selectedCompanyName: string = "";
  data: any | undefined;
 Form1:any; 
 formGroup: any;
 fields:any;
  perviousselectedCompany: any;
  companyPastName: any;
  companyPastSK: any;
previousCompanies: any;
  id: any;
  successmessage: string="";
  successtitle: string="";
  constructor( private router: Router,private storage: StorageService,private authService: AuthService,private fb:FormBuilder,private candidateProfileService :CandidateProfileService) {
    this.formGroup = this.fb.group({
      fields: this.fb.array([])
    });
    
     }
     addField(): void {
     
      const fieldsArray = this.formGroup.get('fields') as FormArray;
      const newField = this.createField();
      fieldsArray.push(newField);
    
      // Initialize autocomplete for the newly added field
      const lastIndex = fieldsArray.length - 1;
      const newFieldGroup = fieldsArray.at(lastIndex) as FormGroup;
      this.initializeAutocomplete(newFieldGroup);
    }
    previousCompanyNameControl:any;
    initializeAutocomplete(fieldGroup: FormGroup): void{
    this. previousCompanyNameControl=fieldGroup.get('previousCompanyName')
    this.filteredOption = this.previousCompanyNameControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: any) => {
        console.log(value);
        if (value && value.length >= 1) {
          return this.authService.getCompanyName(value);
        } else {
          // If value.length is less than 1, return an empty array or null
          return [];
        }
      })
    );
    }
  
    createField(): FormGroup {
      return this.fb.group({
        previousCompanyName: [''],
        previousDesignation: [''],
        previousExperience: ['']
      });
    }
  
    removeField(index: number): void {
      const fieldsArray = this.formGroup.get('fields') as FormArray;
      fieldsArray.removeAt(index);
    }
    isAddButtonDisabled(index: number): boolean {
      const fieldsArray = this.formGroup.get('fields') as FormArray;
     this.fieldGroup1 = fieldsArray.at(index) as FormGroup;
      const previousCompanyName = this.fieldGroup1.get('previousCompanyName').value;
      const previousDesignation = this.fieldGroup1.get('previousDesignation').value;
      const previousExperience = this.fieldGroup1.get('previousExperience').value;
      return !previousCompanyName || !previousDesignation || !previousExperience;
    }
    

    

fieldsGroup:any;
  ngOnInit() {
    console.log(this.employeeProfessionalData)
    
    this.fields = this.workExperienceDetailsList.filter((company: any) => !company.isCurrent);
    console.log(this.fields)
    //  this.selectedCompanyName=this.employeeProfessionalData.companyName;

    // console.log(this.selectedCompanyName)
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: any) => {
        console.log(value)
        this.resetFormFields()
        if (value && value.length >= 1) {
          return this.authService.getCompanyName(value);

        } else {
          // If value.length is less than 1, return an empty array or null
          return [];
        }
      })

    );
    this.emailid=this.storage.get("useremail")
    this. id=this.workExperienceDetails.id
   this.perviousjobs= this.workExperienceDetailsList.filter((company: any) => !company.isCurrent);
    console.log(this.perviousjobs)
 
      
   }
   resetFormFields(): void {
    this.employeeProfessionalData.designation = '';
    this.employeeProfessionalData.department = '';
    this.employeeProfessionalData.workingSince = '';
    //this.employeeProfessionalData.officialEmail='';
    //this.employeeProfessionalData.companyName='';

  }
  resetFormField(){
    this.employeeProfessionalData.designation = '';
    this.employeeProfessionalData.department = '';
    this.employeeProfessionalData.workingSince = '';
  }


  onOptionSelected(event: any): void {
    console.log("on optionselect")


    this.selectedCompany = event.option.value;

  }
  onSelectedPastJob(event: any):void{
   
    this.perviousselectedCompany = event.option.value;
  
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
       
        this.companyPastName = job.name;
        this.companyPastSK = job.SK; 
        console.log( this.companyPastName)
        return job.name;
      } else {
        
        return '';
      }
  }

  isValue: boolean = true;
  ngOnChanges(): void {
    if (this.employeeProfessionalData && this.employeeProfessionalData.companyName && this.employeeProfessionalData.department && this.employeeProfessionalData.designation) {
      this.fields = this.employeeProfessionalData.previousCompanies;
     
      // 
      if (this.employeeProfessionalData && this.employeeProfessionalData.previousCompanies.length == 0) {
        this.addField();
       

        //debugger;
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
   //const nonBlankFields = this.fields.filter((field: { previousCompanyName: string; previousDesignation: string; previousExperience: string; }) => field.previousCompanyName.trim() !== '' || field.previousDesignation.trim() !== '' || field.previousExperience.trim() !== '' );
    // const isCurrent=false
    // Save the non-blank fields\

    const nonBlankFields =  [];
    const fieldsArray = this.formGroup.get('fields') as FormArray;
    for (let i = 0; i < fieldsArray.length; i++) {
      const fieldGroup = fieldsArray.at(i) as FormGroup;
      const companyNameControl = fieldGroup.get('previousCompanyName');
      const designationControl = fieldGroup.get('previousDesignation');
      const experienceControl = fieldGroup.get('previousExperience');
    
      // Check if controls are defined and have a value property
      if(this.perviousselectedCompany){
      if (companyNameControl && designationControl && experienceControl &&
          companyNameControl.value !== null && companyNameControl.value !== undefined &&
          designationControl.value !== null && designationControl.value !== undefined &&
          experienceControl.value !== null && experienceControl.value !== undefined) {
            //const companyPastName = this.companyPastName;

       const companyPastName = companyNameControl.value.name.toString().trim();
       console.log(companyPastName)
        const designation = designationControl.value.toString().trim();
        const experience = experienceControl.value.toString().trim();
        const companyPastSK = companyNameControl.value.SK.toString().trim();
        console.log(companyPastSK)
        if (companyPastName || designation || experience || companyPastSK) {
          nonBlankFields.push({ previousCompanyName:companyPastName , previousDesignation: designation, previousExperience: experience ,companyPastSK:companyPastSK});
        }
      }
    }
    }
    
    
    
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
   // const nonBlankFields = this.fields.filter((field: { previousCompanyName: string; previousDesignation: string; previousExperience: string; }) => field.previousCompanyName.trim() !== '' || field.previousDesignation.trim() !== '' || field.previousExperience.trim() !== '');
    // console.log(this.savedValues)
    // Save the non-blank fields
   const nonBlankFields = [];
    const fieldsArray = this.formGroup.get('fields') as FormArray;
    for (let i = 0; i < fieldsArray.length; i++) {
      const fieldGroup = fieldsArray.at(i) as FormGroup;
      const companyNameControl = fieldGroup.get('previousCompanyName');
      const designationControl = fieldGroup.get('previousDesignation');
      const experienceControl = fieldGroup.get('previousExperience');
    
      // Check if controls are defined and have a value property
      if(this.perviousselectedCompany){
      if (companyNameControl && designationControl && experienceControl &&
          companyNameControl.value !== null && companyNameControl.value !== undefined &&
          designationControl.value !== null && designationControl.value !== undefined &&
          experienceControl.value !== null && experienceControl.value !== undefined) {
            //const companyPastName = this.companyPastName;

       const companyPastName = companyNameControl.value.name.toString().trim();
       console.log(companyPastName)
        const designation = designationControl.value.toString().trim();
        const experience = experienceControl.value.toString().trim();
        const companyPastSK = companyNameControl.value.SK.toString().trim();
        console.log(companyPastSK)
        if (companyPastName || designation || experience || companyPastSK) {
          nonBlankFields.push({ previousCompanyName:companyPastName , previousDesignation: designation, previousExperience: experience ,companyPastSK:companyPastSK});
        }
      }
    }
    }
    
    
    

    console.log(nonBlankFields)
    this.savedValues = [...nonBlankFields];
    this.employeeProfessionalData.previousCompanies = this.savedValues;
    this.employeeProfessionalData.companyName = this.selectedCompany.name ? this.selectedCompany?.name : this.workExperienceDetails?.companyName
    this.employeeProfessionalData.companySK = this.selectedCompany.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.SK
    this.nextStepThird.emit(this.employeeProfessionalData);
    console.log(this.savedValues)
  }

  onPreviousClick() {
  //  const nonBlankFields = this.fields.filter((field: { previousCompanyName: string; previousDesignation: string; previousExperience: string; }) => field.previousCompanyName.trim() !== '' || field.previousDesignation.trim() !== '' || field.previousExperience.trim() !== '');

   const nonBlankFields = [];
    const fieldsArray = this.formGroup.get('fields') as FormArray;
    for (let i = 0; i < fieldsArray.length; i++) {
      const fieldGroup = fieldsArray.at(i) as FormGroup;
      const companyNameControl = fieldGroup.get('previousCompanyName');
      const designationControl = fieldGroup.get('previousDesignation');
      const experienceControl = fieldGroup.get('previousExperience');
    
      // Check if controls are defined and have a value property
      if(this.perviousselectedCompany){
      if (companyNameControl && designationControl && experienceControl &&
          companyNameControl.value !== null && companyNameControl.value !== undefined &&
          designationControl.value !== null && designationControl.value !== undefined &&
          experienceControl.value !== null && experienceControl.value !== undefined) {
            //const companyPastName = this.companyPastName;

       const companyPastName = companyNameControl.value.name.toString().trim();
       console.log(companyPastName)
        const designation = designationControl.value.toString().trim();
        const experience = experienceControl.value.toString().trim();
        const companyPastSK = companyNameControl.value.SK.toString().trim();
        console.log(companyPastSK)
        if (companyPastName || designation || experience || companyPastSK) {
          nonBlankFields.push({ previousCompanyName:companyPastName , previousDesignation: designation, previousExperience: experience ,companyPastSK:companyPastSK});
        }
      }
    }
    }

    // Save the non-blank fields
    this.savedValues = [...nonBlankFields];
    this.employeeProfessionalData.previousCompanies = this.savedValues;
    this.employeeProfessionalData.companyName = this.selectedCompany?.name ? this.selectedCompany?.name : this.workExperienceDetails?.companyName
    this.employeeProfessionalData.companySK = this.selectedCompany?.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.SK
    this.previousStep.emit();
  }

  
    async openOtpModal() {

      try{
      let response= await this.candidateProfileService.employeeEmailVerification(this.emailid,this.id)
      if( response){
        this.openModal(ModalType.OTP_VERIFICATION);
        
      }
     
      }catch{
        this.successmessage= " Official email and personal email should not be the same"
        this.successtitle="Error"
        this.openModal(ModalType.SUCCESS_MESSAGE)
        console.log("error")
      }
  
      
    }
    cancel(){
      this.router.navigate(['/employee/Dashboard']);
      this.closeModal();
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
    window.location.reload()
  }
}
