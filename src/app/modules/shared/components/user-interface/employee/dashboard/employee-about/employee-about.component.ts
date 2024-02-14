import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-employee-about',
  templateUrl: './employee-about.component.html',
  styleUrls: ['./employee-about.component.scss']
})
export class EmployeeAboutComponent {
  @Input() candidateDetails: any = "";
}
