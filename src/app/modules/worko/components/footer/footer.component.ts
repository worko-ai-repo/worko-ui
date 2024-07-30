import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  baseUrl = environment.crossOriginUrl;
// rediectToContactUs() {
// window.location.href = environment.crossOriginUrl + '/contact-us'
// }
// rediectToRefundPolicy() {
// window.location.href = environment.crossOriginUrl + '/refund-policy'
// }
// rediectToPrivacyPolicy() {
// window.location.href = environment.crossOriginUrl + '/privacy-policy'
// }
// rediectToFaq() {
//   window.location.href = environment.crossOriginUrl + '/faq'
// }
// rediectToAboutUs() {
//   window.location.href = environment.crossOriginUrl + '/about-us'
// }

}
