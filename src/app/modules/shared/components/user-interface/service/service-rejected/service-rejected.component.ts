import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-service-rejected',
  templateUrl: './service-rejected.component.html',
  styleUrls: ['./service-rejected.component.scss']
})
export class ServiceRejectedComponent {
  @Input() selectedService: any;
  userType:any;

  referralRaiseIssue(data:any) {

  }
}
