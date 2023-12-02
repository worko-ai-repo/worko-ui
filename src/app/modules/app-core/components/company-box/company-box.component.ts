import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-company-box',
  templateUrl: './company-box.component.html',
  styleUrls: ['./company-box.component.scss']
})
export class CompanyBoxComponent {
  @Input() companyObj: any;
  campanyBoxArray : any=[]=[
    {
      id: 1,
      name: "Google",
      logoUrl: "google.com",
    },
    {
      id: 2,
      name: "flipcart",
      logoUrl: "google.com",
    },
    {
      id: 3,
      name: "amezone",
      logoUrl: "google.com",
    },
    {
      id: 4,
      name: "Google",
      logoUrl: "google.com",
    },
    {
      id: 5,
      name: "Google",
      logoUrl: "google.com",
    },
    {
      id: 6,
      name: "Google",
      logoUrl: "google.com",
    },
    {
      id: 7,
      name: "Google",
      logoUrl: "google.com",
    },
    {
      id: 8,
      name: "Google",
      logoUrl: "google.com",
    },
  ];
  companyBoxObj : any ={
    "id": "", 
    "name": "",
    "logoUrl": "",
   }
}
