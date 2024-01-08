import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @Output() previousStep = new EventEmitter<void>();

  candidateUploadDetails:any={
    uploadCV:"",
    coverLetter:"",
  }
  form:any={

  }
  constructor(){}
  ngOnInit(): void {
      
  }

  async uploadDetails(form:any){
    console.log(this.candidateUploadDetails)
  }

}
