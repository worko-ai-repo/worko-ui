import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @Output() previousStep = new EventEmitter<void>();
  @Output() onSucess = new EventEmitter<void>();

  @Input() candidateUploadDetails:any={
    uploadCV:"",
    coverLetter:"",
  }
  form:any={

  }
  constructor(){}
  ngOnInit(): void {
      
  }

  async uploadDetails(form:any){
    this.onSucess.emit(this.candidateUploadDetails)
    // console.log(this.candidateUploadDetails)
  }

}
