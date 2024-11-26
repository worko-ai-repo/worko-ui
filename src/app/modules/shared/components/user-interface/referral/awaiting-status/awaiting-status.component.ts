import { Component, EventEmitter, Output, Input, OnInit, OnChanges, HostListener, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-awaiting-status',
  templateUrl: './awaiting-status.component.html',
  styleUrls: ['./awaiting-status.component.scss']
})
export class AwaitingStatusComponent implements OnChanges, OnInit, AfterViewInit {

  @Input() screenWidth: any;
  @Input() userType: any;
  @Input() selectedStatus: string = 'Awaiting';
  @Input() referralList: any;
  @Output() statusSelected = new EventEmitter<string>();
  @Output() showReferralDetails = new EventEmitter<string>();
  @Output() scrolledToBottom = new EventEmitter<any>();
  @ViewChild('sentinel') sentinelElement!: ElementRef; // Reference to the sentinel element that triggers bottom scroll detection
  @ViewChild('scrollContainer') scrollContainer!: ElementRef; // Reference to the container element for scrolling

  private observer!: IntersectionObserver; // IntersectionObserver instance for detecting scroll-to-bottom
  private isInitialLoad = true; // Flag to ignore the first trigger of intersection observer

  selectedReferralSK: any;
  isSmallScreen: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateScreenSize();
  }

  updateScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 1251;
  }

  getSlicedValue(value: string): string {
    const parts = value?.split('#');
    return parts?.length > 2 ? parts[2] : '';
  }

  checkValue(value: any) {
    this.referralList = value;
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    // Once the component view is initialized, we set up the intersection observer if the required elements are present
    if (this.scrollContainer && this.sentinelElement && !this.observer) {
      this.setupIntersectionObserver();
    }
  }

  onSelectStatus(status: string): void {
    this.selectedStatus = status;
    this.statusSelected.emit(status);
  }

  ngOnChanges(): void {

    if (this.screenWidth > 1251) {
      if (this.referralList?.length > 0) {
        this.selectedReferralSK = this.referralList[0].SK;
        this.showReferralDetails.emit(this.referralList[0]);
      }
      else {
        this.showReferralDetails.emit("");
      }
      // this.showReferralDetails.emit(this.referralList?.length>0?this.referralList[0]:'');
    }
  }

  ngOnDestroy() {
    // Cleanup the observer when the component is destroyed
    if (this.observer) {
      this.observer.disconnect(); // Disconnect the observer
    }
  }

  showReferralData(item: any) {
    this.selectedReferralSK = item.SK;
    this.showReferralDetails.emit(item);
  }

  get hasReferrals(): boolean {
    return this.referralList && this.referralList.length > 0;
  }


  private setupIntersectionObserver(): void {
    const options = {
      root: this.scrollContainer.nativeElement, // The scroll container is the root for the observer
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Check if the sentinel element is intersecting (visible in the container)
        if (entry.isIntersecting) {
          if (this.isInitialLoad) {
            this.isInitialLoad = false; // Ignore the first trigger to prevent unnecessary action
          } else {
            this.onScrolledToBottom(); // Emit event when scrolled to bottom, excluding the initial load
          }
        }
      });
    }, options);

    // Observe the sentinel element for intersection
    if (this.sentinelElement) {
      this.observer.observe(this.sentinelElement.nativeElement);
    }
  }

  onScrolledToBottom() {
    // console.log('Scrolled to bottom!');
    // Emit an event when scroll reaches the bottom of the container
    this.scrolledToBottom.emit();
  }

}
