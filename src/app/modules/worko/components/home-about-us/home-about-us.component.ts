import { Component, HostListener } from '@angular/core';
import { CareerService } from '../../services/career.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home-about-us',
  templateUrl: './home-about-us.component.html',
  styleUrls: ['./home-about-us.component.scss']
})
export class HomeAboutUsComponent {
  // isSmallScreen!: boolean;
  // isMediumScreen!: boolean;
  // isLargeScreen!: boolean;

  // constructor() {
  //   this.updateScreenSizeFlags();
  // }

  // @HostListener('window:resize', ['$event'])
  // onResize() {
  //   this.updateScreenSizeFlags();
  // }

  // private updateScreenSizeFlags() {
  //   const screenWidth = window.innerWidth;
  //   this.isSmallScreen = screenWidth <= 480; 
  //   this.isMediumScreen = screenWidth > 480 && screenWidth <= 1025; 
  //   this.isLargeScreen = screenWidth > 1025; 
  // }
  fileToUpload: File | null = null;
  fileString: string = "";
  fileName: string = "";
  fileType: string = "";
  fileErr: string = "";
  uploadedCvName: string = "";
  CvCloudFileName:string="";
  form:any
aboutUsForm={
  name:'',
  email:"",
  contactNumber:"",
 description:"",
}
aboutUsData:any;


constructor(private careerService:CareerService,private spinner: NgxSpinnerService){}

  createAboutUs(form:any){
    debugger
    this.uploadCv()
  
  }
async aboutUs(){
  try{
  this.aboutUsData={
    userFullName:this.aboutUsForm.name,
    userEmail:this.aboutUsForm.email,
    userContactNumber:this.aboutUsForm.contactNumber,
    userMessage:this.aboutUsForm.description,
    userCvFileName:this.fileName,
    userCvCloudFileName:this.uploadedCvName,

   }
   console.log(this.aboutUsData)
   await this.careerService.createUser(this.aboutUsData)
  }catch(error){
    console.log(error)
  }
}

  async uploadCv(){
  try {
   let documentDetails = {
       
    careerCVFileName: this.fileName,
    careerCVFileMimeType: this.fileType
      }
      console.log(documentDetails)
      let docResult = await this.careerService.uploadCV(documentDetails);
      console.log(docResult);

      this.uploadedCvName = docResult.cloudFileName;
      this.uploadCVonS3Bucket(docResult);

    } catch(error){
      console.log("error"+error)
    }
 

}
uploadCVonS3Bucket(docResult: any) {
  debugger
  try {
    this.careerService.uploadFileOnS3Bucket(this.fileToUpload!, docResult.awsS3SignedUrl, docResult.awsS3Tag)
      .then(async () => {
        console.log('File uploaded successfully.');
       
        try {
           this.CvCloudFileName = await this.careerService.linkResumewithUser(this.aboutUsForm.email, this.uploadedCvName);
        
        
            this.aboutUs()
        
          this.spinner.hide();
        } catch (error: any) {
          debugger;
          if (error && error.error.message) {
            // this.errorMessage = error.error.message;
            this.spinner.hide();
            //this.setErrorMessage('File Link error linkResumewithUser:- ' + error.error.message);
          }
          console.error('File Link error linkResumewithUser:', error);
        }

      })
      .catch(error => {

        console.error('File upload error:', error);


      });

  } catch (error) {
    console.log(error)
  }
}


handleFileInput(event: Event): void {
  const inputElement = event.target as HTMLInputElement;

  if (inputElement.files) {
    const files: FileList | null = inputElement.files;

    if (files && files.length > 0) {
      const file: File = files[0];

      // Check if the file type is PDF
      if (file.type === 'application/pdf') {
        // Process the PDF file as needed
        this.fileErr = "";
        this.fileToUpload = file;
        this.fileName = file.name;
        this.fileType = file.type;
        console.log('Selected PDF file:', file);
        console.log(this.fileType)
      } else {
        // Display an error for invalid file type
        console.error('Invalid file type. Please upload a PDF file.');
        this.fileErr = "Invalid file type. Please upload a PDF file."
        this.fileName = "";
        // Optionally, you can reset the input to clear the invalid selection
        inputElement.value = '';
        this.fileToUpload = null;
      }
    }
  }
}
}