import { JobApplicationsResponse, JobApplication } from 'src/app/modules/shared/interfaces/job-application.interface';

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';

// export interface JobApplication {
//   jobUrl: string;
//   companyId: string;
//   companyName: string;
//   status: string;
//   createdAt: string;
//   jobId: string;
//   scoreDetails: string;
//   statusTracker: {
//     userType: string;
//     newStatus: string;
//     oldStatus: string;
//     actionDate: string;
//     userId: string;
//   }[];
//   GSI1SK: string;
//   matchingScore: number;
//   GSI2SK: string;
//   GSI2PK: string;
//   GSI1PK: string;
//   jobPortal: string;
//   jdExtracted: string;
//   scoreFetchedDate: string;
//   updatedAt: string;
//   SK: string;
//   jdMatchErrorDesc: string;
//   PK: string;
//   id: string;
//   jobTitle: string;
//   rejectionFeedbackBySystem: string;
//   jdMatchErrorCode: number;

//   // Optional properties for the timeline
//   timelineSteps?: string[]; // Steps in the timeline
//   currentStepIndex?: number; // Current step index in the timeline
// }


@Component({
  selector: 'app-candidate-jobs',
  templateUrl: './candidate-jobs.component.html',
  styleUrls: ['./candidate-jobs.component.scss']
})
export class CandidateJobsComponent implements OnInit {

  jobApplications: JobApplication[] = []; // Use the interface here

  @ViewChild(ModalComponent) modal!: ModalComponent;
  errorMessage: string = "";
  errorTitle: string = "";
  modalType = ModalType;
  modalMessage: string = "";
  modalTitle: string = "";
  modalSize: string = 'md';  // Default modal size
  showClose: boolean = false;  // Default close button visibility
  showModal: ModalType | undefined;
  rejectedReasons: { reason: any; comment: any; userId: any, actionDate: any } | undefined;
  feedbackTitle: string = "Rejection Feedback"
  feedbackDetails: string = "";
  userType = "CAND"

  currentStatus: string = "";
  emailAddress: string = "";

  timeline: any = [
    { step: 'Applied', date: '10/11/2024' },
    { step: 'CV Viewed', date: null },
    { step: 'Processing Interview', date: null },
    { step: 'Hired/Not Selected', date: null },
  ]

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

  statusLabels: { [key: string]: string } = {
    APPLIED: 'APPLIED',
    CV_DOWNLOADED: 'CV DOWNLOADED',
    UNDER_EVALUATION: 'UNDER EVALUATION',
    PROCESSING_INTERVIEW: 'PROCESSING INTERVIEW',
    INTERVIEW_DONE: 'INTERVIEW DONE',
    HIRED: 'HIRED',
    REJECTED: 'REJECTED',
  };

  currentStepIndex: number = 0;


  // // Mock API status (Replace with API data later)
  // currentStatus = 'INTERVIEW_DONE';

  // Compute the index of the current status
  // get currentStepIndex() {
  //   return this.steps.indexOf(this.currentStatus);
  // } 

  getFormattedStep(step: string): string {
    // Replace underscores with spaces and split into words
    const words = step.replace(/_/g, ' ').split(' ');
    // Wrap each word in a span
    return words.map(word => `<span>${word}</span>`).join('<br>');
  }

  constructor(private candidateSrv: CandidateProfileService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private storage: StorageService, private router: Router, private cdrf: ChangeDetectorRef) {

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


  ngOnInit(): void {

    this.emailAddress = this.storage.get("useremail");

    // Listen to route changes

    this.route.paramMap.subscribe(params => {
      const status = params.get('status') || 'applied'; // Default to 'Applied' if no status
      if (status) {
        this.processStatusAndFetchApplications(status);
      }
    });


    //   this.jobApplicationss = [
    //     {
    //       appliedOn: '10/11/2024',
    //       jobTitle: 'Senior Manager Supply Chain & Procurement Operations',
    //       company: 'Urban Company',
    //       matchingScore: '80/100',
    //       totalApplicants: 30,
    //       totalRejected: 20,
    //       status: 'Interview Process Initiated',
    //       timeline: [
    //         { step: 'Applied', date: '10/11/2024' },
    //         { step: 'CV Viewed', date: null },
    //         { step: 'Processing Interview', date: null },
    //         { step: 'Hired/Not Selected', date: null },
    //       ],
    //       action: 'Followup / Request Feedback',
    //     },
    //     {
    //       appliedOn: '10/11/2024',
    //       jobTitle: 'Senior Manager Supply Chain & Procurement Operations',
    //       company: 'Urban Company',
    //       matchingScore: '80/100',
    //       totalApplicants: 30,
    //       totalRejected: 20,
    //       status: 'Not Selected',
    //       timeline: [
    //         { step: 'Applied', date: '10/11/2024' },
    //         { step: 'CV Viewed', date: '10/11/2024' },
    //         { step: 'Not Selected', date: '10/11/2024' },
    //       ],
    //       action: 'Request Feedback',
    //     },
    //   ];
    // }

  }

  processStatusAndFetchApplications(status: string) {
    // Convert hyphens to underscores and transform to uppercase
    const formattedStatus = status.replace(/-/g, '_').toUpperCase();
    this.currentStatus = formattedStatus;

    // Call the API with the formatted status
    this.getAllJobApplicantions(formattedStatus);
  }


  async getAllJobApplicantions(status: string): Promise<void> {
    this.spinner.show();
    this.candidateSrv.getAllJobApplication(this.userType, this.emailAddress, status).then((response: any) => {
      if (response) {
        this.jobApplications = response.data.map((application: JobApplication) => {
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
        await this.getAllJobApplicantions(this.currentStatus);
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

  // canRequestFeedback(application: JobApplication): boolean {
  //   return (
  //     application?.status !== 'REJECTED' &&
  //     application?.followUpRequest !== undefined && // Check if followUpRequest exists
  //     application.followUpRequest.length > 0 // Safely check length
  //   );
  // }



  showMore(jobApplication: any) {
    if (jobApplication?.rejectedByUserId) {
      this.rejectedReasons = jobApplication.rejectedByUserId;
      this.openModal(ModalType.REJECT_DETAILS);
    } else if (jobApplication?.rejectionFeedbackBySystem) {
      this.feedbackDetails = jobApplication.rejectionFeedbackBySystem;
      this.openModal(ModalType.SHOW_MORE_DETAILS);
    }
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

    // Dynamically set modalSize and showClose based on modalType
    if (modalType === this.modalType.SHOW_MORE_DETAILS) {
      this.modalSize = 'lg';
      this.showClose = true;  // Show the close icon for Show More Details
    } else if (modalType === this.modalType.REJECT_DETAILS) {
      this.modalSize = 'md';
      this.showClose = false;  // Hide the close button for Reject Details
    } else {
      this.modalSize = 'md';  // Default size
      this.showClose = false;
    }

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