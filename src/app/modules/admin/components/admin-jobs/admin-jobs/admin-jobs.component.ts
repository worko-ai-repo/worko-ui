//Angular Imports
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

// CKEditor import for rich text editor
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Rxjs import for observable debounceTime, distinctUntilChanged, of, switchMap
import { Observable, debounceTime, distinctUntilChanged, map, of, range, switchMap } from 'rxjs';

// Service module import for Api calling 
import { AdminService } from '../../../services/admin.service';

// Shared components like spinner ,modals and etcetras.
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';

interface FetchJobsOptions {
  jobStatus?: string;
  searchText?: string;
  pageSize?: number;
  sortOrder?: string;
  resetPagination?: boolean;
}

//@component decorator for AdminJobsComponent contains the parent module alias and their paths 
@Component({
  selector: 'app-admin-jobs',
  templateUrl: './admin-jobs.component.html',
  styleUrls: ['./admin-jobs.component.scss']
  
})

/**
 * AdminJobsComponent
 *
 * This component is used to add new jobs, view existing jobs and edit existing jobs
 * 
 * @method ngOnInit - Initialize the component and sets up the filteredCompanies$ observable.
 * 
 * @property {jobForm} FormGroup - The form group for the job form, responsible for managing the state of jobs properties.
 * @property {companyControl} FormControl - The form control for the company selection. 
 */

export class AdminJobsComponent implements OnInit {
  //Common Enums
  status = {
    ALL: '',
    PUBLISHED: 'PUBLISHED',
    ARCHIVED: 'ARCHIVED',
    DRAFT: 'DRAFT',
    CLOSED: 'CLOSED'
  }
  workmode = {
    WFO: 'WFO',
    WFH: 'WFH',
  }
  employmentType = {
    FULL_TIME: 'FULL_TIME',
    PART_TIME: 'PART_TIME',
    CONTRACT: 'CONTRACT',
    INTERNSHIP: 'INTERNSHIP',
  }
  sortOrder = {
    ASC: 'ascending',
    DESC: 'descending'
  }

  experienceRanges = [
    { min: 0, max: 2, label: '0-2' },
    { min: 2, max: 4, label: '2-4' },
    { min: 4, max: 6, label: '4-6' },
    { min: 6, max: 8, label: '6-8' },
    { min: 8, max: 10, label: '8-10' },
    { min: 10, max: 12, label: '10-12' },
    { min: 12, max: 9999, label: '12+' }
  ];

   salaryRanges = [
    { label: '0L - 5L', min: 0, max: 5 },
    { label: '5L - 8L', min: 5, max: 8 },
    { label: '8L - 12L', min: 8, max: 12 },
    { label: '12L - 15L', min: 12, max: 15 },
    { label: '15L - 22L', min: 15, max: 22 },
    { label: '22L - 30L', min: 22, max: 30 },
    { label: '30L +', min: 30, max: Infinity }
  ];
  
  // Properties related to job management
  jobs: any[] = [];
  jobId: string | null = null; // Variable to store the job ID
  dataSource = new MatTableDataSource<any>(); //to store the updated data in the table
  isEditMode: boolean = false;
  selectedStatus: string = this.status.ALL;
  selectedSortOrder: string = this.sortOrder.ASC;
  noJobsMessage: string = 'No Jobs Present';
  public Editor = ClassicEditor;

  public config: any = {
    ckfinder: {
      uploadUrl: '/your-upload-url',
    },
    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
      ],
    },
    enterMode: 1,  // 'paragraph' mode
    shiftEnterMode: 2  // 'br' mode for Shift+Enter
  };

  
  //Filters Properties
  searchQuery: string = '';
  filteredJobs: any[] = [];

  // Properties related to the form
  jobForm: FormGroup;
  companyControl = new FormControl();
  companyNameError: string = '';
  filteredCompanies$: Observable<any[]> = of([]);
  selectedCompany: any = null;
  @ViewChild('autoCompleteInput', { static: false, read: MatAutocompleteTrigger }) trigger!: MatAutocompleteTrigger;

  // Properties related to modal handling
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  showModal: ModalType | undefined;
  modalMessage: string = '';
  modalTitle: string = '';

  // Properties related to modal messages
  successtitle: string = '';
  successmessage: string = '';

  //Pagination Properties
  pageSize: number = 10;
  pageLength: number = 100;
  lastKey: string | undefined = undefined;
  @ViewChild('referralSort') referralSort!: MatSort;
  @ViewChild('referralPaginator') referralPaginator!: MatPaginator;

  // Component properties
  copiedContextId: any;

  /**
   * Initializes the AdminJobsComponent with the required services and sets up the job form.
   *
   * @param {Router} router - The Angular router service.
   * @param {FormBuilder} fb - The Angular form builder service.
   * @param {AdminService} adminService - The admin service for API calls.
   * @param {NgxSpinnerService} spinner - The service for displaying a loading spinner.
   */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
  ) {
    // Initialize the job form with necessary fields and validation
    this.jobForm = this.fb.group({
      status: [this.status.PUBLISHED],
      companyId: [''],
      coreSkills: this.fb.array([], Validators.required),
      department: ['', Validators.required],
      experienceRange: this.fb.group({
        min: [0, [Validators.required, Validators.min(0)]],
        max: [0, [Validators.required, Validators.min(0)]]
      }), 
      jobTitle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      jobDescription: ['', [Validators.required, Validators.minLength(20)]],
      location: ['', Validators.required],
      mislaneiousSkills: this.fb.array([]),
      numOfOpenings: [1, [Validators.required, Validators.min(1)]],
      noticePeriod: [0, [Validators.required, Validators.min(0)]],
      otherRequirements: [''],
      salaryRange: this.fb.group({
        min: [0, [Validators.required, Validators.min(0)]],
        max: [5, [Validators.required, Validators.min(0)]]
      }),
      softSkills: this.fb.array([], Validators.required),
      technicalSkills: this.fb.array([], Validators.required),
      typeofEmployment: ['', Validators.required],
      workMode: ['', Validators.required]
    });
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @this filterCompanies$: This will check the user input and filter the companies based on the input.
   * @this fetchJobs: This will fetch the jobs from the server.
   */
  ngOnInit(): void {

    this.filteredCompanies$ = this.companyControl.valueChanges.pipe(

      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.filterCompanies(value))
    );
    this.jobForm.statusChanges.subscribe(status => {
      console.log('Form status: ', status);
    });
    this.fetchJobs({pageSize : 10 , sortOrder : this.sortOrder.ASC, jobStatus : this.status.ALL, resetPagination:true});
      // Add this to track form validity
/*     this.jobForm.statusChanges.subscribe(status => {
      console.log('Form Status:', status);  // 'VALID' or 'INVALID'
      console.log('Form Validity:', this.jobForm.valid);
      console.log('Form Controls Status:', this.jobForm.controls);
    });

    console.log('Form initialized:', this.jobForm); */
  }

  /**
   * Fetches jobs from the server.
   * 
   */
  async fetchJobs(options:FetchJobsOptions) {
    this.spinner.show();
    try {
      // If resetPagination is true, reset the lastKey
      if (options.resetPagination) {
        this.lastKey = undefined;
      }
      const params = {
        status: options.jobStatus,
        searchText:options.searchText,
        pageSize: options.pageSize,
        lastKey: this.lastKey,
        sortOrder: options.sortOrder
      };
      const response = await this.adminService.getJobs(params);
      if (response) {
        this.jobs = response.data;
        this.lastKey = response.pagination.lastKey;
        this.pageSize = response.pagination.pageSize;

        this.updateData(this.jobs);

        // Reset the paginator to the first page if necessary
        if (options.resetPagination && this.referralPaginator) {
          this.referralPaginator.firstPage();
        }
      }
    } catch (error: any) {
      this.spinner.hide();
      if (error.status === 404) {
        this.router.navigate(['/admin/dashboard']);
      } else if (error.status === 401) {
        this.router.navigate(['/']);
      } else {
        this.successmessage = "Something went wrong. Please try again later.";
        this.successtitle = "Error";
        this.openModal(ModalType.SUCCESS_MESSAGE);
      }
    } finally {
      this.spinner.hide();
    }
  }


  /**
   * updateData: Updates the data in the table.
   */
  // Update data method
  updateData(data: any) {
    this.filteredJobs = data;
    this.dataSource.data = this.filteredJobs;
    this.dataSource.paginator = this.referralPaginator;
    this.dataSource.sort = this.referralSort; // Ensure sorting is applied

    // Optional: Reset the paginator if needed
    if (this.referralPaginator) {
      this.referralPaginator.firstPage();
    }
  }

  // Validation function for common and specific checks
  isInvalid(controlName: string): boolean {
    const control = this.jobForm.get(controlName);
    // Check if the control exists
    if (!control) {
      return false;
    }
    
    // Common validation: control should be invalid and touched/dirty
    return control.invalid && (control.dirty || control.touched);
  }

  // Helper method to get the error message
  getErrorMessage(controlName: string): string | null {
    console.log('Control name:', controlName , this.jobForm.valid);
    const control = this.jobForm.get(controlName);
    if (!control) {
      return `No control found for ${controlName}`;
    }

    // Check if the control is invalid and touched/dirty
    if (control.invalid && (control.dirty || control.touched)) {
      // Check and return specific validation error messages
      if (control.errors) {
        if (control.errors['required']) {
          return 'This field is required';
        }
        if (control.errors['pattern']) {
          return 'Invalid format , allowed symbols [.,?!-\'"]';
        }
        if (control.errors['minlength']) {
          return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
        }
        if (control.errors['maxlength']) {
          return `Maximum length is ${control.errors['maxlength'].requiredLength} characters`;
        }
        if (control.errors['min']) {
          return 'Value must be greater than or equal to the minimum allowed';
        }
        if (control.errors['max']) {
          return 'Value must be less than or equal to the maximum allowed';
        }
      }
    }

    return null;
  }


  //Company Selector starts here: This gorup of method will help in selecting company from a dynamic dropdown menu
  /**
   * Filters companies based on user input by running map() on the response data.
   * @param value - The value entered by the user.
   * @returns Observable of filtered companies.
   */


  filterCompanies(value: string): Observable<any[]> {
    return this.adminService.getCompanyName(value).pipe(
      map(response => {
        const companies = Array.isArray(response.data) ? response.data : [];
        this.companyNameError = companies.length === 0 ? 'No companies found.' : '';
        return companies;
      })
    );
  }

  onCompanySelect(event: any): void {
    const selectedCompany = event.option.value; // Now selectedCompany is the whole object
    this.companyControl.setValue(selectedCompany.name); // Set the name in the input
    // Set company ID or any other required logic
    this.jobForm.get('companyId')?.setValue(selectedCompany.SK.slice(3));
  }
  
  // Optionally, open the autocomplete when user focuses the input
  onInputFocus() {
    if (this.trigger) {
      this.trigger.openPanel();  // Manually open the autocomplete
    }
  }
  onInputBlur(): void {
    const companyNameValue = this.companyControl.value?.trim(); // Check if the input is empty

    if (!companyNameValue) {
      this.companyNameError = 'Company name is required.';
    } else {
      this.companyNameError = ''; // Clear the error if companies are found
    }
  }

  //Company Selector Ends Here

  //Skills selector starts here :This gorup of method will help in selecting skills in the form just by typing and pressing enter.

  // Getters for soft skills and core skills FormArray
  get softSkills(): string[] {
    return (this.jobForm.get('softSkills') as FormArray).controls.map(control => control.value);
  }

  get coreSkills(): string[] {
    return (this.jobForm.get('coreSkills') as FormArray).controls.map(control => control.value);
  }
  get technicalSkills(): string[] {
    return (this.jobForm.get('technicalSkills') as FormArray).controls.map(control => control.value);
  }

  get mislaneiousSkills(): string[] {
    return (this.jobForm.get('mislaneiousSkills') as FormArray).controls.map(control => control.value);
  }

  /**
   * Handles input for skills and adds them to the form array.
   * @param event - The input event.
   */
  onSkillInput(event: Event, skillType: string): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.trim();

    if (value) {
      // Ensure the skill is unique in the array
      const formArray = this.jobForm.get(skillType) as FormArray;
      if (!formArray.value.includes(value)) {
        formArray.push(this.fb.control(value));
      }
      inputElement.value = ''; // Reset the input field
    }
  }

  /**
   * Removes a skill from the form array.
   * @param index - The index of the skill to be removed.
   * @param skillType - The type of skill to remove ('softSkills' or 'coreSkills').
   */
  removeSkill(index: number, skillType: string): void {
    const skills = this.jobForm.get(skillType) as FormArray;
    skills.removeAt(index);
  }
  //Skills selector ends here

  /**
   * @method openModal
   * @description : A global modal method that open 
   * @param modalType - The type of modal to open.
   * @param message - The message to display in the modal.
   * @param title - The title to display in the modal.
   */
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {
    this.showModal = modalType;
    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
  }
  //Closes the currently opened modal
  closeModal(): void {
    this.resetModal();
    this.modal.cancel();
  }

  //Opens the job Form modal
  openModalone(): void {
    this.openModal(ModalType.ADMINJOBS_POPUP);

  }

  //Closes the job Form modal
  resetModal(): void {
    // Reset the form to its initial state
    this.jobForm.reset();
    this.isEditMode = false;
    this.companyControl.reset();
    if (this.trigger) {
      this.trigger.closePanel(); // Manually close the autocomplete
    }

    // Optionally, if you want to reset specific FormArrays like softSkills, coreSkills, etc.
    (this.jobForm.get('softSkills') as FormArray).clear();
    (this.jobForm.get('coreSkills') as FormArray).clear();
    (this.jobForm.get('technicalSkills') as FormArray).clear();
    (this.jobForm.get('mislaneiousSkills') as FormArray).clear();

    // You can also set the form back to its default values if necessary
    this.jobForm.patchValue({
      jobDescription: '',
      salaryRange: '',
      workMode: '',
      // add any other fields you want to reset
    });
  }


  /**
   * @method searchJobs
   * @param query - The search query.  
   */
  async searchJobs(event: any) {
    this.searchQuery = event.target.value;
    console.log('Search query:', this.searchQuery);
    this.fetchJobs({jobStatus :this.selectedStatus, searchText : this.searchQuery, pageSize : 100});
    if (this.filteredJobs.length == 0) {
      this.noJobsMessage = 'No Jobs present with this name or description';
    }
  }
  /**
   * Resets the search input and shows all jobs.
   */
  resetBtnHandler(): void {
    console.log('Reset button clicked');
    this.searchQuery = '';
    this.selectedStatus = this.status.PUBLISHED;
    this.pageSize
    this.fetchJobs({jobStatus:this.selectedStatus , pageSize:this.pageSize , resetPagination:true}); // Fetch jobs with the new status
  }

  /**
   * @method onStausChange - Updates the status of a job. and fetch the desired jobs based on the status.
   * @param event - The status change event.
   */
  onStatusChange(statusVal: any) {
    if (statusVal.target.value === this.status.ALL) {
      this.selectedStatus = this.status.ALL;
      this.fetchJobs({pageSize:this.pageSize , resetPagination:true}); // Fetch all jobs
      return;
    }
    this.selectedStatus = statusVal.target.value; // Update global variable
    this.fetchJobs({jobStatus : this.selectedStatus , pageSize:this.pageSize , resetPagination:true}); // Fetch jobs with the new status
  }

  /**
   * @method onSortChange - Updates the sort order of the jobs.
   * @param event - The sort change event.
   */
  onSortOrderChange(event: any) {
    console.log('Sort order:', event.target.value);
    this.fetchJobs({jobStatus :this.selectedStatus, pageSize : this.pageSize, sortOrder: event.target.value, resetPagination:true});
  }

  /**
   * Edits a job.
   * @param job - The job object to edit.
   */
  editJob(job: any): void {
    this.openModal(ModalType.ADMINJOBS_POPUP);
    this.isEditMode = true; // Set edit mode to true
    this.jobId = job.id;    // Store the job ID
    // Update the form with job data except for the skills
    this.jobForm.patchValue({
      companyId: job.companyId,
      jobTitle: job.jobTitle,
      salaryRange: job.salaryRange,
      numOfOpenings: job.numOfOpenings,
      workMode: job.workMode,
      experienceRange: job.experienceRange,
      noticePeriod: job.noticePeriod,
      jobDescription: job.jobDescription,
      otherRequirements: job.otherRequirements,
      location: job.location,
      typeofEmployment: job.typeofEmployment,
      department: job.department,
      status: job.status
    });
    // Manually set the company name and ID
    this.companyControl.setValue(job.companyDetails.name || ''); // Set company name
    this.jobForm.get('companyId')?.setValue(job.companyId || ''); // Set company ID
    // Clear and repopulate the soft skills FormArray
    const softSkillsArray = this.jobForm.get('softSkills') as FormArray;
    softSkillsArray.clear();
    job.softSkills.forEach((skill: string) => {
      softSkillsArray.push(this.fb.control(skill));
    });

    // Clear and repopulate the core skills FormArray
    const coreSkillsArray = this.jobForm.get('coreSkills') as FormArray;
    coreSkillsArray.clear();
    job.coreSkills.forEach((skill: string) => {
      coreSkillsArray.push(this.fb.control(skill));
    });

    // Clear and repopulate the technicalSkills FormArray
    const technicalSkillsArray = this.jobForm.get('technicalSkills') as FormArray;
    technicalSkillsArray.clear();
    job.technicalSkills.forEach((skill: string) => {
      technicalSkillsArray.push(this.fb.control(skill));
    });

    // Clear and repopulate the mislaneious skills FormArray
    const mislaneiousSkillsArray = this.jobForm.get('mislaneiousSkills') as FormArray;
    mislaneiousSkillsArray.clear();
    job.mislaneiousSkills.forEach((skill: string) => {
      mislaneiousSkillsArray.push(this.fb.control(skill));
    });
  }

  /**
   * Archives a job.
   * @param job - The job object to archive.
   */
  archiveJob = async (job: any,jobStatuschange:string) => {
    console.log(job)
    try {
      const jobData = {
        companyId: job.PK.startsWith('COMP#ID#') ? job.PK.slice(8, -1) : job.PK,
        status: jobStatuschange
      }
      // Update the Status 
      const res = await this.adminService.archiveJob(job.id, jobData);
      console.log(res);
      // Fetch jobs with updated status
      console.log(this.selectedStatus)
      this.fetchJobs({jobStatus :this.selectedStatus, pageSize : this.pageSize, resetPagination:true});
    } catch (error) {
      console.log("Failed to push Job in Archive Section " + error);
    }
  }


  /**
   * Deletes a job.
   * @param job - The job object to delete.
   */
  deleteJob = async (job: any) => {
    try {
      const jobData = {
        companyId: job.PK.startsWith('COMP#ID#') ? job.PK.slice(8, -1) : job.PK,
      }
      const res = await this.adminService.deleteJob(job.id, jobData);
      console.log(res);
      this.fetchJobs({jobStatus :this.selectedStatus, pageSize : this.pageSize});
    } catch (error) {
      console.log("Failed to push Job in Archive Section " + error);
    }
  }

  /**
   * Submits the job form and creates a new job.
   */
  onSubmit(): void {
    // Log whether the form is invalid or not
    console.log('Form is invalid:', this.jobForm.invalid);

    // Loop through all form controls and print their validation status
    Object.keys(this.jobForm.controls).forEach(controlName => {
      const control = this.jobForm.get(controlName);
      console.log(`${controlName} is valid: ${control?.valid}`);

      // If the control is a FormArray, log its inner controls' statuses
      if (control instanceof FormArray) {
        control.controls.forEach((arrayControl, index) => {
          console.log(`${controlName}[${index}] is valid: ${arrayControl.valid}`);
        });
      }
    });

    if (this.jobForm.valid) {
      // Call createJob when in create mode
      if (this.isEditMode && this.jobId) {
        // Update job with the stored job ID
        this.adminService.updateJob(this.jobId, this.jobForm.value)
          .then(response => {
            this.fetchJobs({jobStatus :this.status.PUBLISHED, pageSize : this.pageSize,resetPagination:true});
            this.closeModal();
            this.jobId = null;
          })
          .catch(error => {
            console.error('Error updating job:', error);
          });
      } else {
        this.adminService.createJob(this.jobForm.value)
          .then(response => {
            this.fetchJobs({jobStatus :this.status.PUBLISHED, pageSize : this.pageSize});
            this.closeModal();
          }).catch(error => {
            console.error('Error creating job:', error);
          });
      }
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }


  //Pagination methods
  /**
   * @method onPageChange - this will be called when the user changes the page size
   * @param event 
   */
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    
    // Fetch jobs with pagination reset
    this.fetchJobs({jobStatus :this.selectedStatus, pageSize : this.pageSize, resetPagination:false,sortOrder:this.selectedSortOrder });
  }


  // Misc method
    getStatusClass(status: string): string {
      return `job-${status.toLowerCase()}`; // Returns 'job-published', 'job-closed', 'job-archived'
    }
  
  // Copy the context ID to the clipboard
  copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    this.copiedContextId = id;
    setTimeout(() => {
      this.copiedContextId = null;
    }, 2000);
  }


onSalaryRangeChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const selectedLabel = selectElement.value;
  
  const selectedRange = this.salaryRanges.find(range => range.label === selectedLabel);
  
  if (selectedRange) {
    // Just update the min and max values in the form
    this.jobForm.get('salaryRange')?.patchValue({
      min: selectedRange.min,
      max: selectedRange.max
    });
  }
}

onExperienceRangeChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const selectedLabel = selectElement.value;
  
  const selectedRange = this.experienceRanges.find(range => range.label === selectedLabel);
  
  if (selectedRange) {
    // Update the experienceRange min and max in the form
    this.jobForm.get('experienceRange')?.patchValue({
      min: selectedRange.min,
      max: selectedRange.max
    });
  }
}
}
