import { Component } from '@angular/core';
import { CareerService } from '../../services/career.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home-corporate',
  templateUrl: './home-corporate.component.html',
  styleUrls: ['./home-corporate.component.scss']
})
export class HomeCorporateComponent {

  constructor(private careerService:CareerService,private spinner: NgxSpinnerService){}

  corporateForm={
    name:'',
    email:"",
    contactNumber:"",
   description:"",
   companyName:"",
   designation:"",
  }
  form:any;
  corporateData:any;
  async createCorporate(form:any){
    try{
    this.corporateData={
    userFullName: this.corporateForm.name,
    userEmail:this.corporateForm.email,
    contactNumber: this.corporateForm.contactNumber,
    isContactNumberVerified: false,
    companyName: this.corporateForm.companyName,
    userDesignation:this.corporateForm.designation,
    userMessage: this.corporateForm.description
    }
console.log(this.corporateData)
let response=await this.careerService.createCorporateUser(this.corporateData)
  }catch(error){
    console.log(error)
  }

  }


}
