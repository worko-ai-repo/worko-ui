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

  corporateBulkJdId: string = ''; // Store the ID from the backend response

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
  experienceMin: number | 0 = 0;
  experienceMax: number | 0 = 0;

  uploadedFiles: File[] = [];

  fieldsDisabled: boolean = true; // Initially disable fields
  showFetchDetailsButton: boolean = true; // Show the Fetch Details button initially

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

  fetchDetails(): void {
    this.corporateService.parseJD({ jobDescription: this.jdText }).then((response: any) => {
      console.log('Parse JD Response:', response);
      this.populateFields(response); // Populate fields with the response
      this.showFetchDetailsButton = false; // Remove the Fetch Details button
      this.fieldsDisabled = false; // Enable fields
    }).catch(error => {
      console.error('Error parsing JD:', error);
    });
  }

  populateFields(response: any): void {
    this.mustHaves = response.mustHaves || '';
    this.goodToHaves = response.goodToHaves || '';
    this.experienceMin = response.experienceRange?.min || null;
    this.experienceMax = response.experienceRange?.max || null;
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
    console.log('Updated JD:', this.jdText); // Log the JD for debugging
  }

  updateResumeUploadStatus(isUploaded: boolean): void {
    this.isResumeUploaded = isUploaded;
  }

  updateUploadedFiles(files: File[]): void {
    this.uploadedFiles = files;
    console.log('Updated uploaded files:', this.uploadedFiles);
  }

  submitCriteria(): void {
    const payload = {
      companyId: this.corporateVitalDetails.companyId, // Replace with actual companyId
      jobDescription: this.jdText,
      jobTitle: 'Testing', // Replace with parsed data if available
      mustHaveSkills: this.mustHaves,
      goodToHaveSkills: this.goodToHaves,
      mustNotHaveSkills: this.mustNotHaves,
      experienceRange: {
        min: this.experienceMin,
        max: this.experienceMax,
      },
      bulkCvs: this.uploadedFiles.map(file => ({
        fileName: file.name,
        fileMimeType: file.type,
      })),
    };

    // Submit JD and resume data to backend
    this.corporateService.submitBulkJD(payload).then((response: any) => {
      this.corporateBulkJdId = response.corporateBulkJdId;
      console.log('Bulk JD Response:', response);
      this.uploadToS3(response.bulkCvs);
    }).catch(error => {
      console.error('Error submitting bulk JD:', error);
    });
  }

  uploadToS3(bulkCvs: any[]): void {
    bulkCvs.forEach((fileData, index) => {
      const file = this.uploadedFiles[index];
      this.corporateService.uploadResumeToS3(fileData.awsS3SignedUrl, file).then(() => {
        console.log(`${file.name} uploaded successfully.`);
        if (index === bulkCvs.length - 1) {
          console.log('All resumes uploaded.');
          this.checkProcessingStatus();
        }
      }).catch(error => {
        console.error(`Error uploading ${file.name}:`, error);
      });
    });
  }

  checkProcessingStatus(): void {
    console.log('Checking processing status...');
    this.corporateService.getProcessingStatus(this.corporateBulkJdId, 'PENDING').then((response: any) => {
      console.log('Processing Status:', response);

      if (response.status === 'COMPLETED') {
        console.log('Processing completed. Displaying results...');
        // Navigate to results page or handle results
      } else if (response.status === 'FAILED') {
        console.error('Processing failed.');
      } else {
        console.log('Processing is still pending. Polling again...');
        setTimeout(() => this.checkProcessingStatus(), 5000); // Poll every 5 seconds
      }
    }).catch(error => console.error('Error checking status:', error));
  }

  onSkillInput(event: any, field: string): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (event.key === 'Enter' && value) {
      if (field === 'mustHaves') {
        this.mustHaves.push(value);
      } else if (field === 'goodToHaves') {
        this.goodToHaves.push(value);
      } else if (field === 'mustNotHaves') {
        this.mustNotHaves.push(value);
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
