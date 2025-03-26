import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-mini-job-portal-title',
    templateUrl: './mini-job-portal-title.component.html',
    styleUrls: ['./mini-job-portal-title.component.scss']
})
export class MiniJobPortalTitleComponent {
    @Input() jobDescriptionDetails: any;
    @Input() isJobInvalid: any;

    baseURL = environment.baseUrl;

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
