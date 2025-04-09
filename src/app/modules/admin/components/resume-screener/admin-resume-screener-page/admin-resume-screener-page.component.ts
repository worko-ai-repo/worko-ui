import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { AdminService } from '../../../services/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { ErrorHandlingService } from 'src/app/modules/app-core/services/error-handling.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeScreenerFormComponent } from 'src/app/modules/shared/components/resume-screener-form/resume-screener-form.component';

@Component({
  selector: 'app-admin-resume-screener-page',
  templateUrl: './admin-resume-screener-page.component.html',
  styleUrls: ['./admin-resume-screener-page.component.scss']
})
export class AdminResumeScreenerPageComponent {

  @ViewChild('resumeFormRef') resumeFormComponent!: ResumeScreenerFormComponent;

  adminBulkJdId: string = ''; // Store the ID from the backend response

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

  isValidJD: boolean = false;
  isResumeUploaded: boolean = false;

  jdText: string = '';
  mustHaves: any = [];
  goodToHaves: any = [];
  mustNotHaves: any = [];

  uploadedFiles: File[] = [];

  fieldsDisabled: boolean = true; // Initially disable fields
  showFetchDetailsButton: boolean = true; // Show the Fetch Details button initially

  jdParsedData: any;
  emailAddress: any;
  userDetails: any;

  jobId: string | null = null; // Variable to store the job ID
  jobDetails: any;

  screenerForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private cdr: ChangeDetectorRef, private adminService: AdminService, private spinner: NgxSpinnerService, private storage: StorageService, private errorHandlingService: ErrorHandlingService, private route: ActivatedRoute) {

    this.screenerForm = this.fb.group({
    });

  }

  async ngOnInit() {
    this.emailAddress = this.storage.get("userEmail");
    this.userId = this.storage.get("userId");
    this.jobId = this.route.snapshot.paramMap.get('id');

    if (!this.jobId) {
      this.spinner.show();
      this.successMessage = 'To screen resumes, please first select a job from the job listing page.';
      this.successTitle = 'Alert';

      setTimeout(() => {
        this.spinner.hide();
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      }, 1000);

      return;
    }

    if (this.userId && this.emailAddress && this.jobId) {
      this.spinner.show(); // Show spinner before starting API calls

      try {
        await this.fetchJobDetails(this.jobId);
      } catch (error) {
        console.error("Error", error);
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

  async fetchJobDetails(jobId: any) {
    try {
      const response: any = await this.adminService.getJobDetailsById(jobId);
      if (response) {
        this.jobDetails = response;
        this.jdText = this.getHtmlInnerText(this.jobDetails.jobDescription);
      } else {
        console.warn("Job details response is empty or undefined.");
      }
    } catch (error: any) {
      this.errorHandlingService.handleApiError(error, () => {
        console.error("Error fetching job details:", error);
        this.modalSize = 'md';
        this.successMessage = "Something went wrong. Please try again later.";
        this.successTitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      });

    }
  }

  getHtmlInnerText(html: string): string {
    if (!html) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    return tempDiv.innerText || tempDiv.textContent || '';
  }

  async fetchDetails(): Promise<void> {
    this.spinner.show(); // Show spinner before API call
    try {
      const response = await this.adminService.parseJD({ jobDescription: this.jdText });
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

  populateFields(response: any): void {
    const isValidValue = (value: any) => value !== "Not Mentioned" && value !== null && value !== undefined;
    const sanitizeArray = (arr: any[]) =>
      Array.isArray(arr) ? arr.filter(item => isValidValue(item)) : [];

    this.mustHaves = sanitizeArray(response.coreSkills);
    this.goodToHaves = sanitizeArray(response.goodToHaveSkills);
    this.mustNotHaves = sanitizeArray(response.mustNotHaves);
  }

  updateJDValidation(isValid: boolean): void {
    this.isValidJD = isValid;
  }

  updateJDText(jd: string): void {
    this.screenerForm.patchValue({ jdText: jd });
  }

  updateResumeUploadStatus(isUploaded: boolean): void {
    this.isResumeUploaded = isUploaded;
  }

  updateUploadedFiles(files: File[]): void {
    this.uploadedFiles = files;
    // console.log('Updated uploaded files:', this.uploadedFiles);
  }

  async submitCriteria(): Promise<void> {
    this.spinner.show();
    try {
      const formData = this.resumeFormComponent.getScreenerFormData();
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
        companyId: this.jobDetails?.companyId,
        jobDescription: this.jdText,
        mustHaveSkills: formData.mustHaveSkills,
        goodToHaveSkills: formData.goodToHaveSkills,
        mustNotHaveSkills: formData.mustNotHaveSkills,
        jobTitle: this.jobDetails?.jobTitle,
        experienceRange: this.jobDetails?.experienceRange,
        jobLocation: this.jobDetails?.location?.city[0],
      };

      const jdResponse = await this.adminService.submitJD(payload);
      this.adminBulkJdId = jdResponse.id;

      // Step 2: Upload bulk CVs
      const bulkCvs = this.uploadedFiles.map(file => ({
        fileName: file.name,
        fileMimeType: file.type,
      }));

      const uploadResponse = await this.adminService.uploadBulkCvs(this.adminBulkJdId, bulkCvs);

      // Step 3: Upload files to S3 using signed URLs
      const s3UploadPromises = uploadResponse.bulkCvs.map((fileData: any, index: number) => {
        const file = this.uploadedFiles[index];
        return this.adminService.uploadResumeToS3(fileData.awsS3SignedUrl, file);
      });

      await Promise.all(s3UploadPromises);
      // console.log('All resumes uploaded successfully.');

      // Step 4: Check processing status after 30 seconds

      await new Promise(resolve => setTimeout(resolve, 30000));
      await this.checkProcessingStatus();
    } catch (error: any) {
      this.handleError(error, "Error in resume screening process.");
    } finally {
      this.spinner.hide();
    }
  }

  async uploadToS3(bulkCvs: any[]): Promise<void> {
    this.spinner.show();
    try {

      for (const [index, fileData] of bulkCvs.entries()) {
        const file = this.uploadedFiles[index];
        await this.adminService.uploadResumeToS3(fileData.awsS3SignedUrl, file);
        // console.log(`${file.name} uploaded successfully.`);
      }
      // console.log('All resumes uploaded.');
      this.checkProcessingStatus();

    } catch (error: any) {
      this.handleError(error, "Error uploading resumes to S3.");
    } finally {
      this.spinner.hide();
    }
  }

  async checkProcessingStatus(): Promise<void> {
    this.spinner.show();
    try {
      const response = await this.adminService.getProcessingStatus(this.adminBulkJdId);
      // console.log('Processing Status:', response);

      if (response) {
        this.viewMatchingScoreDetails(this.adminBulkJdId);
      }
    } catch (error: any) {
      this.handleError(error, "Error checking processing status.");
    } finally {
      this.spinner.hide();
    }
  }

  viewMatchingScoreDetails(adminBulkJdId: any): void {
    this.router.navigate(["admin/aCandidateScreener/aMatchingResult/" + adminBulkJdId]);
  }

  private handleError(error: any, defaultMessage: string): void {
    console.error(defaultMessage, error);

    if (error.status === 401) {
      const baseUrl = window.location.origin; // gets "dev-ui.worko.work" or "worko.ai"
      window.location.href = `${baseUrl}/`;
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
    this.router.navigate(['/admin/ajobs']);
    this.closeModal();
  }

}
