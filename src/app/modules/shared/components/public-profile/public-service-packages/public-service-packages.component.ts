import { Component } from '@angular/core';

@Component({
  selector: 'app-public-service-packages',
  templateUrl: './public-service-packages.component.html',
  styleUrls: ['./public-service-packages.component.scss']
})
export class PublicServicePackagesComponent {
  packageForm:any[]=[
    {sName:"Career Guidance", duration:"15 min", amount:"1000" },
    {sName:"Mock Interview", duration:"30 min", amount:"2000" },
    {sName:"Interview Guidance", duration:"30 min", amount:"3000" },
    {sName:"Resume Review", duration:"15 min", amount:"1000" }
   ];

}
