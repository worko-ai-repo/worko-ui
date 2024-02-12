import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';
import { PublicProfileService } from 'src/app/modules/worko/services/public-profile.service';
import { EmployeeProfileService } from '../../services/employee-profile.service';

@Component({
  selector: 'app-employee-packages',
  templateUrl: './employee-packages.component.html',
  styleUrls: ['./employee-packages.component.scss']
})
export class EmployeePackagesComponent implements OnInit {
  emailAddress:any="";
  packageList:any[]=[];
  packageDetails:any={};

  constructor(private publicSrv : PublicProfileService, private storage:StorageService ,private empService:EmployeeProfileService){}

  ngOnInit(): void {
    this.emailAddress = this.storage.get("useremail");
    this.getPackageDetail();
    
  }
  async getPackageDetail(){
    await this.publicSrv.getPublicServices(this.emailAddress).then(async(response)=>{
      this.packageList = response;
      this.packageDetails = this.packageList[0];
    })
    
  }




}
