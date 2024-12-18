import { JobApplicationsResponse, JobApplication } from 'src/app/modules/shared/interfaces/job-application.interface';

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CandidateProfileService } from '../../../services/candidate-profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';

@Component({
  selector: 'app-candidate-jobs',
  templateUrl: './candidate-jobs.component.html',
  styleUrls: ['./candidate-jobs.component.scss']
})
export class CandidateJobsComponent implements OnInit {

  constructor(private candidateSrv: CandidateProfileService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private storage: StorageService, private router: Router, private cdrf: ChangeDetectorRef) {

  }

  @ViewChild(ModalComponent) modal!: ModalComponent;
  errorMessage: string = "";
  errorTitle: string = "";
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  modalSize: string = 'md';  // Default modal size
  showClose: boolean = false;  // Default close button visibility
  showModal: ModalType | undefined;

  jobApplications: JobApplication[] = [];
  userType = "CAND"

  currentStatus: string = "";
  emailAddress: string = "";

  // Define the steps
  steps = [
    'APPLIED',
    'CV_DOWNLOADED',
    'UNDER_EVALUATION',
    'PROCESSING_INTERVIEW',
    'INTERVIEW_DONE',
    'HIRED',
    'REJECTED'
  ];

  loadedOnce: boolean = false;
  isNoLoadData: boolean = false;
  lastKey: string = "";
  count: number = 0;
  pageSize = 25;

  // currentStepIndex: number = 0;

  // // Mock API status (Will replace it with API data later)
  // currentStatus = 'INTERVIEW_DONE';

  // Compute the index of the current status
  // get currentStepIndex() {
  //   return this.steps.indexOf(this.currentStatus);
  // } 

  ngOnInit(): void {

    this.emailAddress = this.storage.get("useremail");

    // Listen to route changes

    this.route.paramMap.subscribe(params => {
      const status = params.get('status') || 'applied'; // Default to 'Applied' if no status
      if (status) {
        this.processStatusAndFetchApplications(status);
      }
    });

  }

  getDateForStep(step: string, index: number, currentApplication: any): string {
    if (step === 'APPLIED') {
      // Use createdAt for "Applied" status
      return currentApplication?.createdAt
        ? new Date(currentApplication.createdAt).toLocaleDateString()
        : '-';
    } else if (step === this.currentStatus) {
      // Use updatedAt for the current status
      return currentApplication?.updatedAt
        ? new Date(currentApplication.updatedAt).toLocaleDateString()
        : '-';
    }
    return ''; // No date for other steps
  }

  processStatusAndFetchApplications(status: string) {
    // Convert hyphens to underscores and transform to uppercase
    const formattedStatus = status.replace(/-/g, '_').toUpperCase();
    this.currentStatus = formattedStatus;

    // Call the API with the formatted status
    this.getAllJobApplicantions(formattedStatus, false);
  }


  async getAllJobApplicantions(status: string, isScrollToBottom: boolean = false): Promise<void> {

    if (!isScrollToBottom) {
      this.lastKey = "";
      this.loadedOnce = false;
      this.isNoLoadData = false;
      this.count = 0;
      this.pageSize = 25;
    }

    this.spinner.show();
    this.candidateSrv.getAllJobApplication(this.userType, this.emailAddress, status, this.pageSize, this.lastKey).then((response: any) => {
      if (response) {

        if (!this.loadedOnce) {
          this.jobApplications = [];
        }

        const jobApplications = response.data.map((application: JobApplication) => {
          const tracker = application.statusTracker || [];

          // If the status is "Rejected," show all statuses up to and including "Rejected."
          if (application.status === "REJECTED") {
            application.timelineSteps = tracker.map(t => t.newStatus).filter(step =>
              this.steps.includes(step)
            );
            // application.timelineSteps.push("REJECTED"); // Explicitly add Rejected to the timeline.
          } else {
            // For non-rejected statuses, show steps up to "Hired."
            application.timelineSteps = this.steps.filter(step => step !== "REJECTED");
          }

          // Determine the current step index
          application.currentStepIndex = application.timelineSteps.indexOf(application.status);
          return application;
        });

        this.jobApplications = this.jobApplications.concat(jobApplications);

        this.loadedOnce = true;
        this.lastKey = response.pagination.lastKey;
        this.count = response.pagination.count;
        this.pageSize = response.pagination.pageSize;

        if (this.count < this.pageSize) { //check to pervent multiple api call
          this.isNoLoadData = true;
        }

        this.spinner.hide();
      }
    }).catch((error: any) => {
      this.spinner.hide();
      if (error.status == 401) {
        this.storage.set('redirectAfterLogin', '/candidate/jobs');
        this.router.navigate(['/']);
      }
      else {
        this.errorMessage = "Something went wrong. Please try again later.";
        this.errorTitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      }
    });
  }

  async requestFeedback(jobApplicationId: string) {

    this.spinner.show();

    const applicationDate = new Date().toISOString(); // Get current date and time in ISO format
    const payload = {
      applicationDate: applicationDate
    };

    await this.candidateSrv.jobApplicationRequestFeedback(jobApplicationId, payload).then(async (response: any) => {

      if (response) {
        this.spinner.hide();
        await this.getAllJobApplicantions(this.currentStatus, false);
        this.errorMessage = "Your request has been successfully sent to the HR team. Please check your email for feedback or a reply.";
        this.errorTitle = "";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      }

    }).catch((error: any) => {
      if (error.status == 401) {
        this.storage.set('redirectAfterLogin', '/candidate/jobs');
        this.router.navigate(['/']);
      }
      else {
        this.spinner.hide();
        this.errorMessage = "Something went wrong. Please try again after sometime";
        this.errorTitle = "Error";
        this.openModal(ModalType.SUCCESS_ERROR_MESSAGE);
      }
    }
    );
  }

  onScrollToBottom() {
    if ((this.lastKey && this.loadedOnce) && !this.isNoLoadData) {
      this.getAllJobApplicantions(this.currentStatus, true);
    }
  }

  // canRequestFeedback(application: JobApplication): boolean {
  //   return (
  //     application?.status !== 'REJECTED' &&
  //     application?.followUpRequest !== undefined && // Check if followUpRequest exists
  //     application.followUpRequest.length > 0 // Safely check length
  //   );
  // }

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

    this.modalSize = 'md';  // Default size
    this.showClose = false;

    this.cdrf.detectChanges();

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

  continue() {
    this.closeModal();
    //window.location.reload();
  }

  cancel() {
    this.closeModal();
  }


}