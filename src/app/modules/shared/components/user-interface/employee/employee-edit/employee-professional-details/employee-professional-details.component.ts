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
  
  @Input() workExperienceDetailsList:any;
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
  previousCompaniesList:any={};
  //fields: { previousCompanyName: string, previousDesignation: string, previousExperience: string }[] = [];
  // Property to store the values entered in the fields
  savedValues: { previousCompanyName: string, previousDesignation: string, previousExperience: string }[] = [];
  //perviousjobs: { previousCompanyName: string, previousDesignation: string, previousExperience: string }[] = [];
  
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  showModal: ModalType | undefined;
  selectedCompanyName: string = "";
  data: any | undefined;
 Form1:any; 
 formGroup: any;
 fields:any;
  constructor(private authService: AuthService,private fb:FormBuilder) {
    this.formGroup = this.fb.group({
      fields: this.fb.array([])
    });
    
     }
    //  addField(): void {
     
    //   const fieldsArray = this.formGroup.get('fields') as FormArray;
    //   const newField = this.createField();
    //   fieldsArray.push(newField);
    
    //   // Initialize autocomplete for the newly added field
    //   const lastIndex = fieldsArray.length - 1;
    //   const newFieldGroup = fieldsArray.at(lastIndex) as FormGroup;
    //   this.initializeAutocomplete(newFieldGroup);
    // }
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
   
  
    // createField(): FormGroup {
    //   return this.fb.group({
    //     previousCompanyName: [''],
    //     previousDesignation: [''],
    //     previousExperience: ['']
    //   });
    // }
  
    removeField(index: number): void {
      const fieldsArray = this.formGroup.get('fields') as FormArray;
      fieldsArray.removeAt(index);
    }
    

    

fieldsGroup:any;
previousCompanies: any ={};
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
      
    // this.previousCompaniesList.forEach((company: any) => {
    //   this.addField(company.previousCompanyName, company.previousDesignation, company.previousExperience);
    // });

   const previousCompanies = this.employeeProfessionalData.previousCompanies;

    // If there are previous companies, populate the FormArray
    if (previousCompanies && previousCompanies.length > 0) {
      previousCompanies.forEach((company: { previousCompanyName: any; previousDesignation: any; previousExperience: any; }) => {
        this.addField(company.previousCompanyName, company.previousDesignation, company.previousExperience);
      });
    }

    console.log(this.fields)
    
      
   }
   
   addField(previousCompanyName = '', previousDesignation = '', previousExperience = ''): void {
    const fieldsArray = this.formGroup.get('fields') as FormArray;
    fieldsArray.push(this.createField(previousCompanyName, previousDesignation, previousExperience));
   
      const lastIndex = fieldsArray.length - 1;
      const newFieldGroup = fieldsArray.at(lastIndex) as FormGroup;
      this.initializeAutocomplete(newFieldGroup);
  }

  // Helper method to create a FormGroup for a previous company
  createField(previousCompanyName = '', previousDesignation = '', previousExperience = ''): FormGroup {
    return this.fb.group({
      previousCompanyName: [previousCompanyName, Validators.required],
      previousDesignation: [previousDesignation, Validators.required],
      previousExperience: [previousExperience, Validators.required]
    });
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
       

        //debugger;
      }
    } else {
      this.getData();
      if (this.employeeProfessionalData && this.employeeProfessionalData.previousCompanies.length == 0) {
        this.addField();
      }
    }
    this.previousCompaniesList = this.workExperienceDetails.filter((company: any) => !company.isCurrent);
   
  }

  getData() {

    this.employeeProfessionalData = {
      companyName: this.workExperienceDetails?.companyName,
      department: this.workExperienceDetails?.department,
      designation: this.workExperienceDetails?.designation,
      workingSince: this.workExperienceDetails?.experienceInMonths,
      officialEmail: this.workExperienceDetails?.emailId ? this.workExperienceDetails?.emailId : "",
      companySK: this.selectedCompany?.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.SK,
      previousCompanies:"",
      isEmailVerified: false,

    }
  }
  fieldGroup1:any;
  isAddButtonDisabled(index: number): boolean {
    const fieldsArray = this.formGroup.get('fields') as FormArray;
   this.fieldGroup1 = fieldsArray.at(index) as FormGroup;
    const previousCompanyName = this.fieldGroup1.get('previousCompanyName').value;
    const previousDesignation = this.fieldGroup1.get('previousDesignation').value;
    const previousExperience = this.fieldGroup1.get('previousExperience').value;
    return !previousCompanyName || !previousDesignation || !previousExperience;
  }
  
  //Method for next step
  updateProfessionalDetails() {
   // const nonBlankFields = this.fields.filter(field => field.previousCompanyName.trim() !== '' || field.previousDesignation.trim() !== '' || field.previousExperience.trim() !== '' );
    // const isCurrent=false
    // Save the non-blank fields\
console.log(this.workExperienceDetails)
    const nonBlankFields = [];
    const fieldsArray = this.formGroup.get('fields') as FormArray;
    for (let i = 0; i < fieldsArray.length; i++) {
      const fieldGroup = fieldsArray.at(i) as FormGroup;
      const companyNameControl = fieldGroup.get('previousCompanyName');
      const designationControl = fieldGroup.get('previousDesignation');
      const experienceControl = fieldGroup.get('previousExperience');
    
      // Check if controls are defined and have a value property
      if (companyNameControl && designationControl && experienceControl &&
          companyNameControl.value !== null && companyNameControl.value !== undefined &&
          designationControl.value !== null && designationControl.value !== undefined &&
          experienceControl.value !== null && experienceControl.value !== undefined) {

            let companyName = '';
            let companySK = '';
        
            // Extract company name and SK from the object
            if (typeof companyNameControl.value === 'object' && companyNameControl.value.hasOwnProperty('name') &&
                companyNameControl.value.hasOwnProperty('SK')) {
              companyName = companyNameControl.value.name;
              companySK = companyNameControl.value.SK;
            }
            companyName = companyName.toString().trim();
        
        // const companyName = companyNameControl.value.toString().trim();
        const designation = designationControl.value.toString().trim();
        const experience = experienceControl.value.toString().trim();
    
        if (companyName || designation || experience) {
          nonBlankFields.push({ previousCompanyName: companyName, previousDesignation: designation, previousExperience: experience,previousCompanySk:companySK });
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
    //const nonBlankFields = this.fields.filter(field => field.previousCompanyName.trim() !== '' || field.previousDesignation.trim() !== '' || field.previousExperience.trim() !== '');
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
      if (companyNameControl && designationControl && experienceControl &&
          companyNameControl.value !== null && companyNameControl.value !== undefined &&
          designationControl.value !== null && designationControl.value !== undefined &&
          experienceControl.value !== null && experienceControl.value !== undefined) {
            let companyName = '';
            let companySK = '';
        
            // Extract company name and SK from the object
            if (typeof companyNameControl.value === 'object' && companyNameControl.value.hasOwnProperty('name') &&
                companyNameControl.value.hasOwnProperty('SK')) {
              companyName = companyNameControl.value.name;
              companySK = companyNameControl.value.SK;
            }
            companyName = companyName.toString().trim();
           
        
        //const companyName = companyNameControl.value.toString().trim();
        const designation = designationControl.value.toString().trim();
        const experience = experienceControl.value.toString().trim();
    
        if (companyName || designation || experience) {
          nonBlankFields.push({ previousCompanyName: companyName, previousDesignation: designation, previousExperience: experience,previousCompanySk:companySK  });
        }
      }
    }
    
    
    this.savedValues = [...nonBlankFields];
    this.employeeProfessionalData.previousCompanies = this.savedValues;
    this.employeeProfessionalData.companyName = this.selectedCompany.name ? this.selectedCompany?.name : this.workExperienceDetails?.companyName
    this.employeeProfessionalData.companySK = this.selectedCompany.SK ? this.selectedCompany?.SK : this.workExperienceDetails?.SK
    this.nextStepThird.emit(this.employeeProfessionalData);
    console.log(this.savedValues)

    console.log(this.workExperienceDetails)
  }

  onPreviousClick() {
    //const nonBlankFields = this.fields.filter(field => field.previousCompanyName.trim() !== '' || field.previousDesignation.trim() !== '' || field.previousExperience.trim() !== '');

    const nonBlankFields = [];
    const fieldsArray = this.formGroup.get('fields') as FormArray;
    for (let i = 0; i < fieldsArray.length; i++) {
      const fieldGroup = fieldsArray.at(i) as FormGroup;
      const companyNameControl = fieldGroup.get('previousCompanyName');
      const designationControl = fieldGroup.get('previousDesignation');
      const experienceControl = fieldGroup.get('previousExperience');
    
      // Check if controls are defined and have a value property
      if (companyNameControl && designationControl && experienceControl &&
          companyNameControl.value !== null && companyNameControl.value !== undefined &&
          designationControl.value !== null && designationControl.value !== undefined &&
          experienceControl.value !== null && experienceControl.value !== undefined) {
            let companyName = '';
            let companySK = '';
        
            // Extract company name and SK from the object
            if (typeof companyNameControl.value === 'object' && companyNameControl.value.hasOwnProperty('name') &&
                companyNameControl.value.hasOwnProperty('SK')) {
              companyName = companyNameControl.value.name;
              companySK = companyNameControl.value.SK;
            }
            companyName = companyName.toString().trim();
           
        
        //const companyName = companyNameControl.value.toString().trim();
        const designation = designationControl.value.toString().trim();
        const experience = experienceControl.value.toString().trim();
    
        if (companyName || designation || experience) {
          nonBlankFields.push({ previousCompanyName: companyName, previousDesignation: designation, previousExperience: experience,previousCompanySk:companySK  });
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
