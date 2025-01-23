import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { JobApplication } from 'src/app/modules/shared/interfaces/job-application.interface';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';

@Component({
  selector: 'app-candidate-jobs-status',
  templateUrl: './candidate-jobs-status.component.html',
  styleUrls: ['./candidate-jobs-status.component.scss']
})
export class CandidateJobsStatusComponent implements AfterViewInit {

  // ViewChildren to get a list of all elements with the #scrollTrigger reference
  @ViewChildren('scrollTrigger') scrollTriggerList!: QueryList<ElementRef>;

  @Input() jobApplications: JobApplication[] = [];
  @Input() userType: string = "";
  @Output() onRequestFeedback: EventEmitter<string> = new EventEmitter<string>();
  @Output() onScrollToBottom: EventEmitter<void> = new EventEmitter<void>();

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

  feedbackTitle: string = "Rejection Feedback";
  feedbackDetails: string = "";

  rejectionTitle: string = "Application Rejected";

  statusLabels: { [key: string]: string } = {
    APPLIED: 'APPLIED',
    CV_DOWNLOADED: 'CV DOWNLOADED',
    UNDER_EVALUATION: 'UNDER EVALUATION',
    PROCESSING_INTERVIEW: 'PROCESSING INTERVIEW',
    INTERVIEW_DONE: 'INTERVIEW DONE',
    HIRED: 'HIRED',
    REJECTED: 'REJECTED',
  };

  // Variable to hold the IntersectionObserver instance
  observer: IntersectionObserver | undefined;

  constructor(private cdrf: ChangeDetectorRef, private el: ElementRef) {

  }

  ngAfterViewInit(): void {

    // This subscription listens for changes in the list of #scrollTrigger elements in the DOM.
    // - When job applications are present, the #scrollTrigger element is added to the DOM.
    // - When there are no job applications, the #scrollTrigger element is removed from the DOM.
    // The subscription ensures that whenever the #scrollTrigger element is added or removed, 
    // the IntersectionObserver is updated to observe the current scroll trigger.
    this.scrollTriggerList.changes.subscribe((list) => {
      // Get the first element in the updated list
      const scrollTrigger = list.first;

      // If an element exists, set up the observer for it
      if (scrollTrigger) {
        this.setupObserver(scrollTrigger.nativeElement);
      }
    });

    // Handle the case where a scrollTrigger element is already present at initialization
    // Initial setup for the first scrollTrigger (if already present)
    const initialTrigger = this.scrollTriggerList.first;
    if (initialTrigger) {
      // Set up the observer for the existing element
      this.setupObserver(initialTrigger.nativeElement);
    }
  }

  // Function to set up the IntersectionObserver for a given element
  private setupObserver(element: HTMLElement): void {
    // If an observer already exists, disconnect it to prevent multiple observers
    if (this.observer) {
      this.observer.disconnect();
    }

    // Create a new IntersectionObserver instance
    this.observer = new IntersectionObserver((entries) => {
      // Check if the observed element is intersecting (visible in the viewport)
      if (entries[0].isIntersecting) {
        // Emit the event to notify the parent that the user scrolled to the bottom
        this.onScrollToBottom.emit();
      }
    });

    // Start observing the specified element
    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    // Clean up the observer to avoid memory leaks
    if (this.observer) {
      this.observer.disconnect();
    }
  }


  getFormattedStep(step: string): string {
    // Replace underscores with spaces and split into words
    const words = step.replace(/_/g, ' ').split(' ');
    // Wrap each word in a span
    return words.map(word => `<span>${word}</span>`).join('<br>');
  }

  requestFeedback(jobApplicationId: string) {
    this.onRequestFeedback.emit(jobApplicationId);
  }

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

    // Strongly typed modal configuration
    const modalConfig: Partial<Record<ModalType, { size: string; close: boolean }>> = {
      [this.modalType.SHOW_MORE_DETAILS]: { size: "lg", close: true }
    };

    // Fallback configuration for undefined modal types
    const config = modalConfig[modalType] || { size: "md", close: false };

    this.modalSize = config.size;
    this.showClose = config.close;

    // Trigger change detection
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
