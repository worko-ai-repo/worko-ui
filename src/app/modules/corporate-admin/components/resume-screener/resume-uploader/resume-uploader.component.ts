import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-resume-uploader',
  templateUrl: './resume-uploader.component.html',
  styleUrls: ['./resume-uploader.component.scss']
})
export class ResumeUploaderComponent implements OnInit {
  ngOnInit(): void { }

  @Output() resumeUploadChange = new EventEmitter<boolean>(); // Emits whether files are uploaded
  @Output() uploadedFilesChange = new EventEmitter<File[]>(); // Emits the list of uploaded files

  fileError: string | null = null;
  uploadedFiles: File[] = []; // To store the uploaded files temporarily

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  onFileClick(): void {
    document.getElementById('resume-upload')?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(input.files);
    }
  }

  // handleFiles(files: FileList): void {
  //   if (files.length > 20) {
  //     this.fileError = 'You can upload up to 20 resumes only.';
  //     return;
  //   }
  //   this.fileError = null;
  //   // Process files here...
  // }

  handleFiles(files: FileList): void {
    const fileArray = Array.from(files);

    // Check for file limit
    if (fileArray.length + this.uploadedFiles.length > 200) {
      this.fileError = 'You can upload up to 200 resumes only.';
      return;
    }

    this.fileError = null;

    // Append new files to the uploadedFiles array
    this.uploadedFiles.push(...fileArray);

    // Emit both the upload status and the files to the parent
    this.resumeUploadChange.emit(this.uploadedFiles.length > 0);
    this.uploadedFilesChange.emit(this.uploadedFiles);

    // Log the file details
    // console.log('Uploaded files:', this.uploadedFiles.map(file => ({
    //   name: file.name,
    //   size: `${(file.size / 1024).toFixed(2)} KB`,
    //   type: file.type,
    // })));
  }


}
