import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CorporateService } from '../../../services/corporate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { Router } from '@angular/router';

export interface CorporateVitalDetails {
  cognitoUserId?: string;
  cognitoUserGroup?: string;
  companyId?: string;
  corporateUserType?: string;
  companyName?: string;
  userId?: string;
  email?: string;
}

@Component({
  selector: 'app-resume-screener-page',
  templateUrl: './resume-screener-page.component.html',
  styleUrls: ['./resume-screener-page.component.scss']
})
export class ResumeScreenerPageComponent {

  jobTitle: string = '';
  jobTitleTouched: boolean = false; // Tracks whether the field has been touched
  jobTitleError: string | null = null; // Holds error messages

  corporateBulkJdId: string = ''; // Store the ID from the backend response
  skillsTooltipMessage = "Type a skill and press Enter to add it to the list.";

  // Properties related to modal handling
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  showModal: ModalType | undefined;
  modalMessage: string = "";
  modalTitle: string = "";

  // Properties related to modal messages
  successTitle: string = "";
  modalSize: string = "md";
  showClose: boolean = false;
  successMessage: string = "";

  userId: any = " ";
  userType: any;

  // Corporate Jobs Component Properties
  corporateVitalDetails: CorporateVitalDetails = {};

  isValidJD: boolean = false;
  isResumeUploaded: boolean = false;

  jdText: string = '';
  mustHaves: any = [];
  goodToHaves: any = [];
  mustNotHaves: any = [];
  experienceMin!: number;
  experienceMax!: number;

  uploadedFiles: File[] = [];

  fieldsDisabled: boolean = true; // Initially disable fields
  showFetchDetailsButton: boolean = true; // Show the Fetch Details button initially

  jdParsedData: any;

  private timeoutId: any;

  constructor(private router: Router, private cdr: ChangeDetectorRef, private corporateService: CorporateService, private spinner: NgxSpinnerService, private storage: StorageService) { }

  async ngOnInit() {
    this.corporateVitalDetails.cognitoUserId = this.storage.get("cognitoUserId");

    if (this.corporateVitalDetails.cognitoUserId) {
      this.spinner.show(); // Show spinner before starting API calls

      try {
        await this.fetchUserDetailsWithCompany(this.corporateVitalDetails.cognitoUserId);
      } catch (error) {
        console.error("Error in ngOnInit while fetching user details:", error);
        this.modalSize = 'md';
        this.successMessage = "Something went wrong. Please try again after some time.";
        this.successTitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      } finally {
        this.spinner.hide(); // Ensure spinner hides regardless of success or failure
      }
    }
    else {
      this.modalSize = 'md';
      this.successMessage = "Something went wrong. Please try again after some time.";
      this.successTitle = "Error";
      this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
    }

  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  async fetchDetails(): Promise<void> {
    this.spinner.show(); // Show spinner before API call
    try {
      const response = await this.corporateService.parseJD({ jobDescription: this.jdText });
      // console.log('Parse JD Response:', response);
      this.jdParsedData = response;
      this.populateFields(response);
      this.showFetchDetailsButton = false;
      this.fieldsDisabled = false;
    } catch (error: any) {
      this.handleError(error, "Error parsing job description.");
    } finally {
      this.spinner.hide(); // Hide spinner after API call
    }
  }

  // Populate fields with API response
  // populateFields(response: any): void {
  //   this.mustHaves = response.coreSkills || [];
  //   this.goodToHaves = response.goodToHaveSkills || [];
  //   this.mustNotHaves = response?.mustNotHaves || [];
  //   this.experienceMin = response.experienceRange?.min || null;
  //   this.experienceMax = response.experienceRange?.max || null;
  // }

  populateFields(response: any): void {
    // Helper function to check if a value is valid
    const isValidValue = (value: any) => value !== "Not Mentioned" && value !== null && value !== undefined;

    // Handle arrays and numbers separately
    const sanitizeArray = (arr: any[]) =>
      Array.isArray(arr) ? arr.filter(item => isValidValue(item)) : [];

    this.mustHaves = sanitizeArray(response.coreSkills) || [];
    this.goodToHaves = sanitizeArray(response.goodToHaveSkills) || [];
    this.mustNotHaves = sanitizeArray(response.mustNotHaves) || [];

    // Assign numbers only if they are valid
    if (isValidValue(response.experienceRange?.min)) {
      this.experienceMin = +response.experienceRange.min;
    }

    if (isValidValue(response.experienceRange?.max)) {
      this.experienceMax = +response.experienceRange.max;
    }

    // Populate job title
    if (isValidValue(response.jobTitle)) {
      this.jobTitle = response.jobTitle.trim(); // Assign and trim the job title
    }

    this.validateJobTitle(); // Triggering validation explicitly
  }


  // Fetching the user details with company
  async fetchUserDetailsWithCompany(cognitoUserId: string) {
    try {
      let userDetail = await this.corporateService.getCorporateUserDetailById(cognitoUserId);

      if (userDetail) {
        this.corporateVitalDetails.companyId = userDetail[0]?.companyId || null;
        this.corporateVitalDetails.corporateUserType = userDetail[0]?.corporateUserType || null;
        this.userType = userDetail[0]?.corporateUserType || null;
        this.corporateVitalDetails.userId = userDetail[0]?.id || null;
        this.corporateVitalDetails.email = userDetail[0]?.email || null;

        // console.log(this.corporateVitalDetails);

        // Fetch job details and applications after user details are fetched
        // if (this.jobId) {
        //   await this.fetchJobDetails(this.jobId);
        //   this.getJobLink();
        //   this.getAllJobApplications(null);
        // } else {
        //   console.warn("Job ID is not available.");
        // }
      } else {
        console.warn("No user details found for the given Cognito User ID.");
      }
    }
    catch (error) {
      console.error("Error fetching user details:", error);
      throw error; // Let ngOnInit handle the modal and spinner
    }
  }

  updateJDValidation(isValid: boolean): void {
    this.isValidJD = isValid;
  }

  updateJDText(jd: string): void {
    this.jdText = jd;
    // console.log('Updated JD:', this.jdText); // Log the JD for debugging
  }

  updateResumeUploadStatus(isUploaded: boolean): void {
    this.isResumeUploaded = isUploaded;
  }

  updateUploadedFiles(files: File[]): void {
    this.uploadedFiles = files;
    // console.log('Updated uploaded files:', this.uploadedFiles);
  }

  // Mark the Job Title field as touched
  markJobTitleTouched(): void {
    this.jobTitleTouched = true;
  }

  // Validate the Job Title dynamically
  validateJobTitle(): void {
    if (!this.jobTitle.trim()) {
      this.jobTitleError = 'Job Title is required.';
    } else if (this.jobTitle.length > 100) {
      this.jobTitleError = 'Job Title must not exceed 100 characters.';
    } else {
      this.jobTitleError = null; // Clear any previous errors
    }
  }

  // Final validation to call during form submission
  isJobTitleValid(): boolean {
    return !this.jobTitleError; // If no error, it's valid
  }

  async submitCriteria(): Promise<void> {
    this.spinner.show();
    try {
      // Step 1: Submit JD and related details
      const payload: {
        companyId: string | undefined;
        jobDescription: string;
        mustHaveSkills: any;
        goodToHaveSkills: any;
        mustNotHaveSkills: any;
        experienceRange?: any;
        // bulkCvs: { fileName: string; fileMimeType: string }[];
        jobTitle: string;
        jobLocation?: string; // Optional property
      } = {
        companyId: this.corporateVitalDetails.companyId,
        jobDescription: this.jdText,
        mustHaveSkills: this.mustHaves,
        goodToHaveSkills: this.goodToHaves,
        mustNotHaveSkills: this.mustNotHaves,
        jobTitle: this.jobTitle,
        // bulkCvs: this.uploadedFiles.map(file => ({
        //   fileName: file.name,
        //   fileMimeType: file.type,
        // })),
      };

      // Handle experienceRange
      const experienceRange = this.getExperienceRange();
      if (experienceRange) {
        payload.experienceRange = experienceRange;
      }

      // if (this.jdParsedData && this.jdParsedData.jobTitle) {
      //   payload.jobTitle = this.jdParsedData?.jobTitle;
      // }

      if (this.jdParsedData && this.jdParsedData.location) {
        payload.jobLocation = this.jdParsedData?.location;
      }

      const jdResponse = await this.corporateService.submitJD(payload);
      this.corporateBulkJdId = jdResponse.id;

      // Step 2: Upload bulk CVs
      const bulkCvs = this.uploadedFiles.map(file => ({
        fileName: file.name,
        fileMimeType: file.type,
      }));

      const uploadResponse = await this.corporateService.uploadBulkCvs(this.corporateBulkJdId, bulkCvs);

      // Step 3: Upload files to S3 using signed URLs
      const s3UploadPromises = uploadResponse.bulkCvs.map((fileData: any, index: number) => {
        const file = this.uploadedFiles[index];
        return this.corporateService.uploadResumeToS3(fileData.awsS3SignedUrl, file);
      });

      await Promise.all(s3UploadPromises);
      // console.log('All resumes uploaded successfully.');

      // Step 4: Check processing status after 30 seconds

      await new Promise(resolve => setTimeout(resolve, 30000));
      await this.checkProcessingStatus();

      // Submit JD and resume data to backend
      // const response = await this.corporateService.submitBulkJD(payload);
      // this.corporateBulkJdId = response.corporateBulkJdId;
      // console.log('Bulk JD Response:', response);
      // this.uploadToS3(response.bulkCvs);
    } catch (error: any) {
      this.handleError(error, "Error in resume screening process.");
    } finally {
      this.spinner.hide();
    }
  }

  getExperienceRange(): { min?: number; max?: number } | null {
    const min = this.normalizeExperienceValue(this.experienceMin);
    const max = this.normalizeExperienceValue(this.experienceMax);

    // If both are null, return null to exclude experienceRange
    if (min === null && max === null) {
      return null;
    }

    // Build and return the experienceRange object
    const experienceRange: { min?: number; max?: number } = {};
    if (min !== null) {
      experienceRange.min = min;
    }
    if (max !== null) {
      experienceRange.max = max;
    }

    return experienceRange;
  }

  private normalizeExperienceValue(value: number | string | null): number | null {
    if (value === null || value === undefined || value === "not mentioned") {
      return null;
    }
    const num = Number(value);
    return !isNaN(num) ? num : null;
  }

  async uploadToS3(bulkCvs: any[]): Promise<void> {
    this.spinner.show();
    try {

      for (const [index, fileData] of bulkCvs.entries()) {
        const file = this.uploadedFiles[index];
        await this.corporateService.uploadResumeToS3(fileData.awsS3SignedUrl, file);
        // console.log(`${file.name} uploaded successfully.`);
      }
      // console.log('All resumes uploaded.');
      this.checkProcessingStatus();

    } catch (error: any) {
      this.handleError(error, "Error uploading resumes to S3.");
    } finally {
      this.spinner.hide();
    }
    // bulkCvs.forEach((fileData, index) => {
    //   const file = this.uploadedFiles[index];
    //   this.corporateService.uploadResumeToS3(fileData.awsS3SignedUrl, file).then(() => {
    //     console.log(`${file.name} uploaded successfully.`);
    //     if (index === bulkCvs.length - 1) {
    //       console.log('All resumes uploaded.');
    //       this.checkProcessingStatus();
    //     }
    //   }).catch(error => {
    //     console.error(`Error uploading ${file.name}:`, error);
    //   });
    // });
  }

  async checkProcessingStatus(): Promise<void> {
    this.spinner.show();
    try {
      const response = await this.corporateService.getProcessingStatus(this.corporateBulkJdId);
      // console.log('Processing Status:', response);

      if (response) {
        this.viewMatchingScoreDetails(this.corporateBulkJdId);
      }

      // if (response.status === 'COMPLETED') {
      //   console.log('Processing completed. Displaying results...');
      //   // Handle results or navigate
      // } else if (response.status === 'FAILED') {
      //   console.error('Processing failed.');
      // } else {
      //   console.log('Processing is still pending. Polling again...');
      //   setTimeout(() => this.checkProcessingStatus(), 5000); // Poll every 5 seconds
      // }
    } catch (error: any) {
      this.handleError(error, "Error checking processing status.");
    } finally {
      this.spinner.hide();
    }
  }

  viewMatchingScoreDetails(corporateBulkJdId: any): void {
    this.router.navigate(["corporate/cCandidateScreener/cMatchingResult/" + corporateBulkJdId]);
  }

  // onSkillInput(event: any, field: string): void {
  //   const input = event.target as HTMLInputElement;
  //   const value = input.value.trim();

  //   if (event.key === 'Enter' && value) {
  //     if (field === 'mustHaves') {
  //       this.mustHaves.push(value);
  //     } else if (field === 'goodToHaves') {
  //       this.goodToHaves.push(value);
  //     } else if (field === 'mustNotHaves') {
  //       this.mustNotHaves.push(value);
  //     }
  //     input.value = ''; // Clear input field after adding
  //   }
  // }

  onSkillInput(event: any, field: string): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (event.key === 'Enter' && value) {
      if (field === 'mustHaves') {
        if (!this.mustHaves.includes(value)) {
          this.mustHaves.push(value);
        }
      } else if (field === 'goodToHaves') {
        if (!this.goodToHaves.includes(value)) {
          this.goodToHaves.push(value);
        }
      } else if (field === 'mustNotHaves') {
        if (!this.mustNotHaves.includes(value)) {
          this.mustNotHaves.push(value);
        }
      }
      input.value = ''; // Clear input field after adding
    }
  }


  removeSkill(index: number, field: string): void {
    if (field === 'mustHaves') {
      this.mustHaves.splice(index, 1);
    } else if (field === 'goodToHaves') {
      this.goodToHaves.splice(index, 1);
    } else if (field === 'mustNotHaves') {
      this.mustNotHaves.splice(index, 1);
    }
  }

  private handleError(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);

    if (error.status === 401) {
      this.router.navigate(['/auth/corporate/login']);
      return
    }
    
    if (error.status === 404) {
      this.router.navigate(["/corporate/cJobs"]);
      return;
    }

    this.modalSize = 'md';
    this.successMessage = "Something went wrong. Please try again later.";
    this.successTitle = "Error";
    this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
  }

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

    // Strongly typed modal configuration
    const modalConfig: Partial<Record<ModalType, { size: string; close: boolean }>> = {
      [this.modalType.SHOW_MORE_DETAILS]: { size: "lg", close: true },
      [this.modalType.VIEW_CV]: { size: "xl", close: true },
      [this.modalType.REJECTED_REQUEST]: { size: "md", close: true }
    };

    // Fallback configuration for undefined modal types
    const config = modalConfig[modalType] || { size: "md", close: false };

    this.modalSize = config.size;
    this.showClose = config.close;

    this.cdr.detectChanges();

    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
  }

  // Closes the currently opened modal
  closeModal(): void {
    this.modal.cancel();
  }

  continue() {
    this.router.navigate(['/corporate/cJobs']);
    this.closeModal();
  }

}
