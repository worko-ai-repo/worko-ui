import { Component } from '@angular/core';
import { CandidateProfileService } from '../../services/candidate-profile.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent {
  servicesList: any = "";
  emailAddress: any = "";
  selectedStatus: string = 'AWAITING';
  selectedReferral: any;
  constructor(private candidateSrv: CandidateProfileService, private storage: StorageService) { }
  
  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    // this.getServices();
  }

  async getServices() {
    await this.candidateSrv.getServices(this.emailAddress, this.selectedStatus).then(async (response) => {
      if (response) {
        this.servicesList = response;
        console.log(this.servicesList + '123');
      }
    })
  }

  onStatusSelected(status: string): void {
    this.selectedStatus = status;
     this.getServices();
  }
}
