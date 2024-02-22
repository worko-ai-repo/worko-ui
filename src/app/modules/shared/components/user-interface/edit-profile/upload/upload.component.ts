import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @Output() previousStep = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<void>();
  @Input() candidateList: any;
  @Input() candidateUploadDetails: any;
  // {
  //   uploadCV: "",
  //   coverLetter: "",
  // }
  form: any = {

  }
  fileToUpload: File | null = null;
  fileName: string = "";
  fileType: string = "";
  showfileError: boolean =false;
  constructor() { }
  ngOnInit(): void {

  }

  async uploadDetails(form: any) {
    this.onSuccess.emit(this.candidateUploadDetails)
    // console.log(this.candidateUploadDetails)
  }

  ngOnChanges(): void {
    // console.log(this.candidateList, "candidateList");
    if (this.candidateUploadDetails.coverLetter) {

    } else {
      this.getData();
    }

    // console.log(this.candidateUploadDetails)
  }
  getData() {
    this.candidateUploadDetails = {
      uploadCV: this.candidateList.CV,
      coverLetter: this.candidateList.coverLetter,
      fileName: "",
      fileToUpload: "",
      fileType: ""
    }
    this.fileName = this.candidateList.CV;
  }

  goBack() {
    this.previousStep.emit(this.candidateUploadDetails);
  }

  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement.files) {
      const files: FileList | null = inputElement.files;
  
      if (files && files.length > 0) {
        const file: File = files[0];
  
        // Check if the file type is PDF or DOCX
        if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // Process the file as needed
          this.fileToUpload = file;
          this.fileName = file.name;
          this.fileType = file.type;
          this.candidateUploadDetails.fileName = this.fileName;
          this.candidateUploadDetails.fileToUpload = this.fileToUpload;
          this.candidateUploadDetails.fileType = this.fileType;
          this.showfileError = false;
          console.log('Selected file:', file);
        } else {
          // Display an error for invalid file type
          console.error('Invalid file type. Please upload a PDF or DOCX file.');
          // Optionally, you can reset the input to clear the invalid selection
          this.showfileError = true;
          inputElement.value = '';
          this.fileToUpload = null;
          this.fileName = "";
          this.fileType = "";
    
        }
      }
    }
  }
  
}
