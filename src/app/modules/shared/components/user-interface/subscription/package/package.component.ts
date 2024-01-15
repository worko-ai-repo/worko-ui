import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent {
  @Input() packageDetails: any;
  @Input() subscriptionList: any;

  ngOnInit(): void {
   
    // this.emailAddress = this.storage.get("useremail");

  }

  ngOnChanges(): void {
    
  }
}
