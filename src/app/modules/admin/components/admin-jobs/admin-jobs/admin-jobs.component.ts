//Angular Imports
import { Router } from "@angular/router";
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from "@angular/forms";

// Rxjs import for observable debounceTime, distinctUntilChanged, of, switchMap
import { Observable, debounceTime, distinctUntilChanged, map, of,  switchMap } from "rxjs";

// Service module import for Api calling
import { AdminService } from "../../../services/admin.service";

// Shared components like spinner ,modals and etcetras.
import { MatSort } from "@angular/material/sort";
import { ModalType } from "src/app/modules/shared/interfaces/shared.interface";
import { MatPaginator } from "@angular/material/paginator";
import { ModalComponent } from "src/app/modules/shared/components/modal/modal.component";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material/table";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";

// Interface for FetchJobsOptionsDto
interface FetchJobsOptionsDto {
  jobStatus?: string;
  searchText?: string;
  pageSize?: number;
  sortOrder?: string;
  resetPagination?: boolean;
}
interface RangeDropDownDto {
  label: string;
  value: {
    min: number;
    max: number;
  };
}

@Component({
  selector: "app-admin-jobs",
  templateUrl: "./admin-jobs.component.html",
  styleUrls: ["./admin-jobs.component.scss"],
  encapsulation: ViewEncapsulation.None,
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
  ngxSummerConfig: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      link: [['link', ['linkDialogShow', 'unlink']]],
    },
    height: '200px',
    uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['undo', 'redo']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear'
        ]
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['link', 'hr']],
      ['view',['help','fullscreen']],
    ],
  };

  // Common Enums
  status = {
    ALL: "",
    PUBLISHED: "PUBLISHED",
    ARCHIVED: "ARCHIVED",
    DRAFT: "DRAFT",
    CLOSED: "CLOSED",
  };
  workmode = {
    WFO: "WFO",
    WFH: "WFH",
  };
  employmentType = {
    FULL_TIME: "FULL_TIME",
    PART_TIME: "PART_TIME",
    CONTRACT: "CONTRACT",
    INTERNSHIP: "INTERNSHIP",
  };
  sortOrder = {
    ASC: "ascending",
    DESC: "descending",
  };

  // List of experience ranges and salary ranges
  experienceRange: RangeDropDownDto[] = [
    { label: "0-1", value: { min: 0 , max: 1, } },
    { label: "1-3", value: { min: 1, max: 3 } },
    { label: "3-6", value: { min: 3, max: 6 } },
    { label: "6-9", value: { min: 6, max: 9 } },
    { label: "9-12", value: { min: 9, max: 12 } },
    { label: "12-15", value: { min: 12, max: 15 } },
    { label: "15-20", value: { min: 15, max: 20 } },
    { label: "20-25", value: { min: 20, max: 25 } },
    { label: "25+", value: { min: 25, max: 9999 } },
  ];
  

  salaryRange: RangeDropDownDto[] = [
    { label: "0L - 5L", value: { min: 0, max: 5 } },
    { label: "5L - 10L", value: { min: 5, max: 10 } },
    { label: "10L - 15L", value: { min: 10, max: 15 } },
    { label: "15L - 22L", value: { min: 15, max: 22 } },
    { label: "22L - 30L", value: { min: 22, max: 30 } },
    { label: "30L - 40L", value: { min: 30, max: 40 } },
    { label: "40L - 50L", value: { min: 40, max: 50 } },
    { label: "50L - 70L", value: { min: 50, max: 70 } },
    { label: "70L+", value: { min: 70, max: 9999 } },
  ];
  
  workMode = [
    {value : "WFH", name: "Work From Home"},
    {value : "WFO", name: "Work From Office"},
    {value : "HYBRID", name: "Hybrid"},
  ]

  // Properties related to job management
  jobs: any[] = []; // To store the fetched jobs
  jobId: string | null = null; // Variable to store the job ID
  dataSource = new MatTableDataSource<any>(); // To store the updated data in the table
  isEditMode: boolean = false;
  selectedStatus: string = this.status.ALL;
  selectedSortOrder: string = this.sortOrder.DESC;
  noJobsMessage: string = "No Jobs Present"; // Will be showin inside the table
  isCompanyNameValid: boolean = false;

  //Filters Properties
  searchQuery: string = "";
  filteredJobs: any[] = [];

  // Properties related to the form
  jobForm: FormGroup;
  companyControl = new FormControl(); // Form control for company selection
  companyNameError: string = "";
  filteredCompanies$: Observable<any[]> = of([]);
  selectedCompany: any = null;
  @ViewChild("autoCompleteInput", { static: false, read: MatAutocompleteTrigger }) trigger!: MatAutocompleteTrigger;
  @ViewChild('refSalaryRange') refSalaryRange!: ElementRef;
  @ViewChild('refExpRange') refExpRange!: ElementRef;

  // Properties related to modal handling
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  showModal: ModalType | undefined;
  modalMessage: string = "";
  modalTitle: string = "";

  // Properties related to modal messages
  successtitle: string = "";
  modalSize : string = "xl";
  successmessage: string = "";

  //Pagination Properties
  
  lastKey: string | null = null; // The current lastKey for the current page
  previousKeys: string[] = []; // Stack to store previous lastKeys for "Previous" functionality
  hasNext: boolean = false; // To enable/disable "Next" button
  hasPrevious: boolean = false; // To enable/disable "Previous" button
  pageSize: number = 25; // Default page size
  pageSizeOptions: number[] = [25, 50, 100, 150];

  @ViewChild("companyJobMatSort") companyJobMatSort!: MatSort;
  @ViewChild("companyJobMatPaginator") companyJobMatPaginator!: MatPaginator;

  // Component properties
  copiedContextId: any;
  skillsTooltipMessage = "Type a skill and press Enter to add it to the list.";

  /**
   * Initializes the AdminJobsComponent with the required services and sets up the job form.
   *
   * @param {Router} router - The Angular router service.
   * @param {FormBuilder} fb - The Angular form builder service.
   * @param {AdminService} adminService - The admin service for API calls.
   * @param {NgxSpinnerService} spinner - The service for displaying a loading spinner.
   */
  constructor(private router: Router, private fb: FormBuilder, private adminService: AdminService, private spinner: NgxSpinnerService ,private cdr: ChangeDetectorRef) {
    // Initialize the job form with necessary fields and validation
    this.jobForm = this.fb.group({
      status: [this.status.PUBLISHED],
      companyId: ["",Validators.required],
      coreSkills: this.fb.array([], Validators.required),
      department: ["", [Validators.required]],
      experienceRange:[null, Validators.required],
      jobTitle: ["", [Validators.required, Validators.minLength(3)]],
      jobDescription: ["", [Validators.required, Validators.minLength(20)]],
      location: ["", Validators.required],
      mislaneiousSkills: this.fb.array([]),
      numOfOpenings: [1, [Validators.required, Validators.min(1)]],
      noticePeriod: [0, [Validators.required, Validators.min(0)]],
      otherRequirements: [""],
      salaryRange: [null, Validators.required],
      softSkills: this.fb.array([], Validators.required),
      technicalSkills: this.fb.array([], Validators.required),
      typeofEmployment: ["", Validators.required],
      workMode: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    // Setup the filteredCompanies$ for the company autocomplete
    this.filteredCompanies$ = this.companyControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => this.filterCompanies(value))
    )
      // Fetch jobs on component initialization
    this.fetchJobs({ pageSize: 25, sortOrder: this.sortOrder.DESC, jobStatus: this.status.ALL, resetPagination: true });
  }

  // @TODO Add to reusable code
  /**
   * toTitleCase
   * 
   * Converts a string to title case.
   */
  toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  /**
   * fetchJobs
   *
   * Fetches jobs from the server.By taking options as args and
   */
  async fetchJobs(options: FetchJobsOptionsDto) {
    this.spinner.show();
    try {
      // If resetPagination is true, reset the lastKey
      if (options.resetPagination) {
        this.lastKey = null;
      }
      const params = {
        status: options.jobStatus,
        searchText: options.searchText,
        pageSize: options.pageSize,
        lastKey: this.lastKey,
        sortOrder: options.sortOrder,
      };
      const response = await this.adminService.getJobs(params);
      if (response) {
        this.jobs = response.data;
        this.lastKey = response.pagination.lastKey || null;
        this.pageSize = response.pagination.pageSize;

        this.hasNext = !!response.pagination.lastKey;
        this.hasPrevious = this.previousKeys.length > 0;

        this.updateData(this.jobs);

        // Reset the paginator to the first page if necessary when mat-paginator is available and resetPagination is true
        if (options.resetPagination && this.companyJobMatPaginator) {
          this.companyJobMatPaginator.firstPage();
        }
      }
    } catch (error: any) {
      this.spinner.hide();
      if (error.status === 404) {
        this.router.navigate(["/admin/dashboard"]);
      } else if (error.status === 401) {
        this.router.navigate(["/"]);
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
    this.dataSource.paginator = this.companyJobMatPaginator;
    this.dataSource.sort = this.companyJobMatSort; // Ensure sorting is applied

    // Optional: Reset the paginator if needed
    if (this.companyJobMatPaginator) {
      this.companyJobMatPaginator.firstPage();
    }
  }

  // Validation function for common and specific checks
  isInvalid(controlName: string): boolean {
    const control = this.jobForm.get(controlName);

    if (!control) {
      return false;
    }
    // Common validation: control should be invalid and touched/dirty
    return control.invalid && (control.dirty || control.touched);
  }

  // Helper method to get the error message
  getErrorMessage(controlName: string): string | null {
    const control = this.jobForm.get(controlName);

    // Check if the control is invalid and touched/dirty
    if (this.isInvalid(controlName)) {
      // Check and return specific validation error messages
      if (control?.errors) {
        if (control.errors["required"]) {
          return "This field is required";
        }
        if (control.errors["pattern"]) {
          return "Invalid format , allowed symbols [.,?!-'\"]";
        }
        if (control.errors["minlength"]) {
          return `Minimum length is ${control.errors["minlength"].requiredLength} characters`;
        }
        if (control.errors["maxlength"]) {
          return `Maximum length is ${control.errors["maxlength"].requiredLength} characters`;
        }
        if (control.errors["min"]) {
          return "Value must be greater than or equal to the minimum allowed";
        }
        if (control.errors["max"]) {
          return "Value must be less than or equal to the maximum allowed";
        }
      }
    }

    return null;
  }

  // Method to mark form control as touched when user leaves the input
  markControlAsTouched(controlName: string): void {
    const control = this.jobForm.get(controlName);
    if (control) {
      control.markAsTouched(); // Marks control as touched to trigger validation
    }
  }
  /* Company Selector starts here: This gorup of method will help in selecting company from a dynamic dropdown menu */

  // Fetch the companies and return the list
  filterCompanies(value: string): Observable<any[]> {
    return this.adminService.getCompanyName(value).pipe(
      map((response) => {
        const companies = Array.isArray(response.data) ? response.data : [];
        this.isCompanyNameValid = companies.length === 0 ? false : true;
        this.companyNameError = companies.length === 0 ? "No companies found." : "";
        return companies;
      })
    );
  }

  // Display the company name in the input when selected
  onCompanySelect(event: any): void {
    const selectedCompany = event.option.value; // Now selectedCompany is the whole object
    this.companyControl.setValue(selectedCompany.name); // Set the name in the input
    // Set company ID or any other required logic
    this.jobForm.get("companyId")?.setValue(selectedCompany.SK.slice(3));
  }

  // Optionally, open the autocomplete when user focuses the input
  onInputFocus() {
    if (this.trigger) {
      this.trigger.openPanel(); // Manually open the autocomplete
    }
  }

  // Validate the company name on blur
  onInputBlur(): void {
    const companyNameValue = this.companyControl.value?.trim(); // Check if the input is empty
    // If the input is empty, show an error
    let companyIdCheck = this.jobForm.get("companyId")?.value === null || this.jobForm.get("companyId")?.value === "";
    if (companyNameValue === "" || companyNameValue === null) {
      this.companyNameError = "Company name is required.";
      this.isCompanyNameValid =false;
    } 
     if(companyIdCheck) {
      this.companyNameError = "Please select a company from the list.";
      this.isCompanyNameValid =false;
    }
    if(companyIdCheck && companyNameValue === "") {
      this.companyNameError = ""; // Clear the error if companies are found
      this.isCompanyNameValid =true;
    }
  }

  /* Company Selector Ends Here */

  /* Skills selector starts here :This gorup of method will help in selecting skills in the form just by typing and pressing enter. */

  get softSkills(): string[] {
    return (this.jobForm.get("softSkills") as FormArray).controls.map((control) => control.value);
  }

  get coreSkills(): string[] {
    return (this.jobForm.get("coreSkills") as FormArray).controls.map((control) => control.value);
  }
  get technicalSkills(): string[] {
    return (this.jobForm.get("technicalSkills") as FormArray).controls.map((control) => control.value);
  }

  get mislaneiousSkills(): string[] {
    return (this.jobForm.get("mislaneiousSkills") as FormArray).controls.map((control) => control.value);
  }

  /**
   * onSkillInput
   *
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
      inputElement.value = ""; // Reset the input field
    }
  }

  /**
   * removeSkill
   *
   * Removes a skill from the form array.
   * @param index - The index of the skill to be removed.
   * @param skillType - The type of skill to remove ('softSkills' or 'coreSkills').
   */
  removeSkill(index: number, skillType: string): void {
    const skills = this.jobForm.get(skillType) as FormArray;
    skills.removeAt(index);
  }

  /* Skills selector ends here */

  /* Modal Handler Section Starts Here */

  /**
   * openModal
   *
   * A global modal method that open
   *
   * @param modalType - The type of modal to open.
   * @param message - The message to display in the modal.
   * @param title - The title to display in the modal.
   */
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {
    this.showModal = modalType;
    // Reset modal size every time you open the modal
    if(modalType === this.modalType.SUCCESS_MESSAGE ){
      this.modalSize = "md";
    }
    else {
        this.modalSize = "xl";
    }
    this.cdr.detectChanges();
    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
  }

  // Closes the currently opened modal
  closeModal(): void {
    this.resetModal();
    this.companyControl.enable();
    this.isEditMode = false;
    this.modal.cancel();
  }

  // Opens the job Form modal
  openModalone(): void {
    this.openModal(ModalType.ADMINJOBS_POPUP);
  }
  
  // Reset the job Form modal
  resetModal(): void {
    // Reset the form to its initial state
    if (this.isEditMode) {
      // Reset other fields but keep companyId as is
      this.jobForm.patchValue({
        status: this.status.PUBLISHED,
        coreSkills: [],
        department: "",
        experienceRange: null,
        jobTitle: "",
        jobDescription: "",
        location: "",
        mislaneiousSkills: [],
        numOfOpenings: 1,
        noticePeriod: 0,
        otherRequirements: "",
        salaryRange: null,
        softSkills: [],
        technicalSkills: [],
        typeofEmployment: "",
        workMode: "",
      });
    } else {
      // If not in edit mode, reset the entire form including companyId
      this.jobForm.reset();
      this.companyControl.reset();
    }
    this.jobForm.get('status')?.patchValue(this.status.PUBLISHED);
    if (this.trigger) {
      this.trigger.closePanel(); // Manually close the autocomplete
    }

    // Optionally, if you want to reset specific FormArrays like softSkills, coreSkills, etc.
    (this.jobForm.get("softSkills") as FormArray).clear();
    (this.jobForm.get("coreSkills") as FormArray).clear();
    (this.jobForm.get("technicalSkills") as FormArray).clear();
    (this.jobForm.get("mislaneiousSkills") as FormArray).clear();

    this.jobForm.get('experienceRange')?.patchValue(null);
    this.jobForm.get('salaryRange')?.patchValue(null)

    // You can also set the form back to its default values if necessary
    this.jobForm.patchValue({
      jobDescription: "",
      workMode: "",
      location: "",
      noticePeriod: 0,
      typeofEmployment: "",
      otherRequirements: "",
      numOfOpenings: 1,
    });
  }

  /*
   * @method searchJobs
   * @param query - The search query.
   */
  async searchJobs(event: any) {
    this.searchQuery = event.target.value;
/*     console.log("Search query:", this.searchQuery);
 */    this.fetchJobs({ jobStatus: this.selectedStatus, searchText: this.searchQuery, pageSize: 200 });
    if (this.filteredJobs.length == 0) {
      this.noJobsMessage = "No Jobs present with this name or description";
    }
  }
  /**
   * Resets the search input and shows all jobs.
   */
  resetBtnHandler(): void {
/*     console.log("Reset button clicked");
 */    this.searchQuery = "";
    this.selectedStatus = this.status.PUBLISHED;
    this.fetchJobs({ jobStatus: this.selectedStatus, pageSize: this.pageSize, resetPagination: true }); // Fetch jobs with the new status
  }

  /**
   * onStausChange
   *
   * Updates the status of a job. and fetch the desired jobs based on the status.
   */
  onStatusChange(statusVal: any) {
    if (statusVal.target.value === this.status.ALL) {
      this.selectedStatus = this.status.ALL;
      this.fetchJobs({ pageSize: this.pageSize, resetPagination: true }); // Fetch all jobs
      return;
    }
    this.selectedStatus = statusVal.target.value; // Update global variable
    this.fetchJobs({ jobStatus: this.selectedStatus, pageSize: this.pageSize, resetPagination: true }); // Fetch jobs with the new status
  }

  /**
   * onSortOrderChange
   *
   * Updates the sort order of the jobs.
   */
  onSortOrderChange(event: any) {
/*     console.log("Sort order:", event.target.value);
 */    this.fetchJobs({ jobStatus: this.selectedStatus, pageSize: this.pageSize, sortOrder: event.target.value, resetPagination: true });
  }

  // Edit Job Function
  editJob(job: any): void {
    this.openModal(ModalType.ADMINJOBS_POPUP);
    this.companyControl.disable(); // Disable the company input
    this.isEditMode = true; // Set edit mode to true
    this.jobId = job.id; // Store the job ID
    // Update the form with job data except for the skills
    this.jobForm.patchValue({
      companyId: job.companyId,
      jobTitle: this.toTitleCase(job.jobTitle), 
      numOfOpenings: job.numOfOpenings,
      workMode: job.workMode,
      noticePeriod: job.noticePeriod,
      jobDescription: job.jobDescription,
      otherRequirements: job.otherRequirements,
      location: job.location,
      typeofEmployment: job.typeofEmployment,
      department: this.toTitleCase(job.department),
      status: job.status,
    });
    // Patch salaryRange separately
    this.jobForm.get("salaryRange")?.patchValue({
      min: job.salaryRange.min,
      max: job.salaryRange.max,
    });

    // Patch experienceRange separately
    this.jobForm.get("experienceRange")?.patchValue(
     job.experienceRange
    );

    // Manually set the company name and ID
    this.companyControl.setValue(job.companyDetails.name || ""); // Set company name
    this.jobForm.get("companyId")?.setValue(job.companyId || ""); // Set company ID

    // Clear and repopulate the soft skills FormArray
    const softSkillsArray = this.jobForm.get("softSkills") as FormArray;
    softSkillsArray.clear();
    job.softSkills.forEach((skill: string) => {
      softSkillsArray.push(this.fb.control(this.toTitleCase(skill)));
    });

    // Clear and repopulate the core skills FormArray
    const coreSkillsArray = this.jobForm.get("coreSkills") as FormArray;
    coreSkillsArray.clear();
    job.coreSkills.forEach((skill: string) => {
      coreSkillsArray.push(this.fb.control(this.toTitleCase(skill)));
    });

    // Clear and repopulate the technicalSkills FormArray
    const technicalSkillsArray = this.jobForm.get("technicalSkills") as FormArray;
    technicalSkillsArray.clear();
    job.technicalSkills.forEach((skill: string) => {
      technicalSkillsArray.push(this.fb.control(this.toTitleCase(skill)));
    });

    // Clear and repopulate the mislaneious skills FormArray
    const mislaneiousSkillsArray = this.jobForm.get("mislaneiousSkills") as FormArray;
    mislaneiousSkillsArray.clear();
    job.mislaneiousSkills.forEach((skill: string) => {
      mislaneiousSkillsArray.push(this.fb.control(this.toTitleCase(skill)));
    });
    // Reset the Ranges
    const ranges = {
      refSalaryRange: this.salaryRange,
      refExpRange: this.experienceRange,
    };

      // Loop through the ranges and reset selectedIndex
      setTimeout(() => {
        Object.entries(ranges).forEach(([refKey, RangeKey]) => {
          for (const [index, key] of RangeKey.entries()) {
            const isMatched = 
              (refKey === 'refSalaryRange' && key.value.min === job.salaryRange.min && key.value.max === job.salaryRange.max) ||
              (refKey === 'refExpRange' && key.value.min === job.experienceRange.min && key.value.max === job.experienceRange.max);
    
            if (isMatched) {
              this[refKey].nativeElement.selectedIndex = index + 1; 
              break; // Exit the loop after finding the match 
            }
          }
        });
      }, 100); // Adjust the timeout as necessary
  }

  /**
   * Archives a job.
   * @param job - The job object to archive.
   */
  updateJobStatus = async (job: any, newStatus: string) => {
/*     console.log(job);
 */    try {
      this.spinner.show();
      const jobData = {
        companyId: job.PK.startsWith("COMP#ID#") ? job.PK.slice(8, -1) : job.PK,
        status: newStatus,
      };
      if (newStatus === this.status.CLOSED) {
        await this.adminService.deleteJob(job.id, jobData);
      } else {
        this.adminService.archiveJob(job.id, jobData);
      }

      // This will  Give time to If  Codition in the HTML to work as expected
      setTimeout(() => {
        this.fetchJobs({ jobStatus: this.selectedStatus, pageSize: this.pageSize, resetPagination: true, sortOrder: this.selectedSortOrder });
      }, 1000);
    } catch (error) {
      this.successmessage = "Something went wrong. Please try again later.";
      this.successtitle = "Error";
      this.openModal(ModalType.SUCCESS_MESSAGE);
    } finally {
      this.spinner.hide();
    }
  };

  /**
   * Submits the job form and creates a new job.
   */
  onSubmit(): void {
    // Log whether the form is invalid or not
/*     console.log("Form is invalid:", this.jobForm.invalid);
 */
    // Loop through all form controls and print their validation status
    Object.keys(this.jobForm.controls).forEach((controlName) => {
      const control = this.jobForm.get(controlName);
      // console.log(`${controlName} is valid: ${control?.valid}`);
 
      // If the control is a FormArray, log its inner controls' statuses
      if (control instanceof FormArray) {
        control.controls.forEach((arrayControl, index) => {
          //  console.log(`${controlName}[${index}] is valid: ${arrayControl.valid}`);
        });
      }
    });

    if (this.jobForm.valid && this.companyNameError === "") {
      // Call createJob when in create mode
      if (this.isEditMode && this.jobId) {
        this.spinner.show();
        // Update job with the stored job ID
        this.adminService
          .updateJob(this.jobId, this.jobForm.value)
          .then((response) => {
            this.fetchJobs({ jobStatus: this.selectedStatus, pageSize: this.pageSize, resetPagination: true, sortOrder: this.selectedSortOrder });
            this.closeModal();
            this.jobId = null;
          })
          .catch((error) => {
            this.successmessage = "Something went wrong. Please try again later.";
            this.successtitle = "Error";
            this.openModal(ModalType.SUCCESS_MESSAGE);
          })
          .finally(() => {
            this.spinner.hide();
          });
      } else {
        this.spinner.show();
        this.adminService
          .createJob(this.jobForm.value)
          .then((response) => {
            this.fetchJobs({ jobStatus: this.selectedStatus, pageSize: this.pageSize, resetPagination: true, sortOrder: this.selectedSortOrder });
            this.closeModal();
          })
          .catch((error) => {
            this.successmessage = "Something went wrong. Please try again later.";
            this.successtitle = "Error";
            this.openModal(ModalType.SUCCESS_MESSAGE);
          })
          .finally(() => {
            this.spinner.hide();
          });
      }
    }
  }

  //Pagination methods
  /**
   * @method onPageChange - this will be called when the user changes the page size
   * @param event
   */

  onNext() {
    if (!this.hasNext) return;

    // Store the current lastKey in the stack before moving forward
    if (this.lastKey) {
      this.previousKeys.push(this.lastKey);
    }

    // Fetch the next page
    this.fetchJobs({ jobStatus: this.selectedStatus, searchText: this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder , resetPagination: false });
  }


  onPrevious() {
    if (!this.hasPrevious) return;

    // Retrieve the second-to-last key in the stack, which corresponds to the last key used for the previous page
    const previousLastKey = this.previousKeys.length > 1 ? this.previousKeys[this.previousKeys.length - 2] : null;

    // Remove the current page's lastKey from the stack
    this.previousKeys.pop();

    if (!previousLastKey) {
      // If no valid previous key, fetch the first page
      this.fetchJobs({ jobStatus: this.selectedStatus, searchText: this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder, resetPagination: true });
    } else {
      // Fetch the previous page using the second-to-last key
     this.lastKey = previousLastKey;
     this.fetchJobs({ jobStatus: this.selectedStatus, searchText: this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder, resetPagination: false });
    }
  }

  onPageSizeChange(event: Event): void {
    const selectedPageSize = (event.target as HTMLSelectElement).value;
    this.pageSize = Number(selectedPageSize);
    this.previousKeys = [];
    this.fetchJobs({ jobStatus: this.selectedStatus, searchText: this.searchQuery, pageSize: this.pageSize, sortOrder: this.selectedSortOrder, resetPagination: true });
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
  };

  navigateToJobReferral(event: MouseEvent, companyName: string, jobTitle: string, jobID: any): void {
    event.preventDefault(); // Prevent default anchor behavior
  
    // Encode the company name and job title for URL-safe navigation
    const formattedCompanyName = companyName.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const formattedJobTitle = jobTitle.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s*&\s*/g, '&').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const route = `/company/jobs/${formattedCompanyName}-jobs/${formattedJobTitle}-${jobID}`;

    // Open the route in a new tab
    window.open(route, '_blank');
  }
 
  viewJobDetailsandApplications(jobId: any): void {
    this.router.navigate(["admin/aApplicants/"+jobId])
  }
  
  /**
   * formatRange 
   * 
   * Formats the range values based on the type.
   */
  formatRange(min: number, max: number, type: string): string {
    if (type === 'experience') {
    if (min === 0 && max === 0) return '-'; // Handling edge case for no experience range
    return `${min}-${max} ${max === 1 ? 'Year' : 'Years'}`;
    } else if (type === 'salary') {
    if (min === 0 && max === 0) return '-'; // Handling edge case for no salary range
    return `${min}-${max} LPA`;
    }
    return '-'; // Default value
    }
}