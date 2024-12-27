import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-mini-job-portal-description',
  templateUrl: './mini-job-portal-description.component.html',
  styleUrls: ['./mini-job-portal-description.component.scss']
})
export class MiniJobPortalDescriptionComponent implements OnInit, OnChanges {
  sanitizedHtml: SafeHtml | undefined;
  @Output() requestReferral = new EventEmitter<void>();
  @Input() jobDescriptionDetails: any;
  @Input() isJobInvalid:any;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Check if jobDescriptionDetails has changed and is defined
    if (changes['jobDescriptionDetails'] && changes['jobDescriptionDetails'].currentValue) {
      this.setHtmlContent(this.jobDescriptionDetails.jobDescription); // Sanitize the new content
    }
  }

  ngOnInit() {
    // Initialize sanitized HTML if jobDescriptionDetails is already available
    if (this.jobDescriptionDetails) {
      this.setHtmlContent(this.jobDescriptionDetails.jobDescription);
    }
  }

  // Method to sanitize HTML content using DomSanitizer
  setHtmlContent(content: string) {
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(content);
  }

  onRequestReferral() {
    this.requestReferral.emit();
  }

  shareCurrentUrl() {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: url
      });
    } else {
      // Fallback for browsers that do not support the Web Share API
      navigator.clipboard.writeText(url).then(() => {
        alert('URL copied to clipboard: ' + url);
      }).catch((error) => {

      });
    }
  }
}
