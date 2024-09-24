import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-mini-job-portal-description',
  templateUrl: './mini-job-portal-description.component.html',
  styleUrls: ['./mini-job-portal-description.component.scss']
})
export class MiniJobPortalDescriptionComponent {

  @Output() requestReferral = new EventEmitter<void>();
  @Input()  jobDescriptionDetails:any;

  constructor(){}

  ngOnChanges(changes: SimpleChanges): void {
  
    if (changes['jobDescriptionDetails'] && changes['jobDescriptionDetails'].currentValue) {


    }
  }

  ngOnInit(){
    
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
        })
    } else {
        // Fallback for browsers that do not support the Web Share API
        navigator.clipboard.writeText(url).then(() => {
            alert('URL copied to clipboard: ' + url);
        }).catch((error) => {
           
        });
    }
}

}
