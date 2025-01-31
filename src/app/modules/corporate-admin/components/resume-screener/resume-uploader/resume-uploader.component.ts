import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { ModalType } from 'src/app/modules/shared/interfaces/shared.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume-uploader',
  templateUrl: './resume-uploader.component.html',
  styleUrls: ['./resume-uploader.component.scss']
})
export class ResumeUploaderComponent implements OnInit {
  filteredNewFiles: any;

  ngOnInit(): void { }
  constructor(private router: Router, private cdr: ChangeDetectorRef) {

  }

  // Properties related to modal handling
  @ViewChild(ModalComponent) modal!: ModalComponent;
  modalType = ModalType;
  showModal: ModalType | undefined;
  modalMessage: string = "";
  modalTitle: string = "";

  // Properties related to modal messages
  successTitle: string = "";
  modalSize: string = "md";
  showClose: boolean = false;
  successMessage: string = "";

  @Output() resumeUploadChange = new EventEmitter<boolean>(); // Emits whether files are uploaded
  @Output() uploadedFilesChange = new EventEmitter<File[]>(); // Emits the list of uploaded files

  fileError: string | null = null;
  uploadedFiles: File[] = []; // To store the uploaded files temporarily
  duplicateFiles: string[] = []; // Store duplicate file names
  limitedDuplicates: string[] = [];

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

    // Reset file input field to allow same file selection again
    input.value = '';
  }

  // handleFiles(files: FileList): void {
  //   if (files.length > 20) {
  //     this.fileError = 'You can upload up to 20 resumes only.';
  //     return;
  //   }
  //   this.fileError = null;
  //   // Process files here...
  // }

  // handleFiles(files: FileList): void {
  //   const fileArray = Array.from(files);

  //   // Check for file limit
  //   if (fileArray.length + this.uploadedFiles.length > 200) {
  //     this.fileError = 'You can upload up to 200 resumes only.';
  //     return;
  //   }

  //   this.fileError = null;

  //   // Append new files to the uploadedFiles array
  //   this.uploadedFiles.push(...fileArray);

  //   // Emit both the upload status and the files to the parent
  //   this.resumeUploadChange.emit(this.uploadedFiles.length > 0);
  //   this.uploadedFilesChange.emit(this.uploadedFiles);

  //   // Log the file details
  //   // console.log('Uploaded files:', this.uploadedFiles.map(file => ({
  //   //   name: file.name,
  //   //   size: `${(file.size / 1024).toFixed(2)} KB`,
  //   //   type: file.type,
  //   // })));
  // }

  // handleFiles(files: FileList): void {
  //   const fileArray = Array.from(files);
  //   const existingFiles = new Set(this.uploadedFiles.map(file => `${file.name}-${file.size}`));

  //   this.duplicateFiles = []; // Reset duplicates list
  //   this.filteredNewFiles = []; // Store valid files for later

  //   fileArray.forEach(file => {
  //     const fileKey = `${file.name}-${file.size}`;
  //     if (existingFiles.has(fileKey)) {
  //       this.duplicateFiles.push(file.name); // Store duplicate names
  //     } else {
  //       this.filteredNewFiles.push(file); // Store valid files
  //     }
  //   });

  //   if (fileArray.length + this.uploadedFiles.length > 200) {
  //     this.fileError = 'You can upload up to 200 resumes only.';
  //     return;
  //   }

  //   if (this.duplicateFiles.length > 0) {
  //     // Limit display to 5 duplicates
  //     this.limitedDuplicates = this.duplicateFiles.slice(0, 5);
  //     this.openDuplicateModal();
  //   } else {
  //     // If no duplicates, add all new files directly
  //     this.uploadedFiles.push(...this.filteredNewFiles);
  //     this.emitFileChanges();
  //   }
  // }

  handleFiles(files: FileList): void {
    const fileArray = Array.from(files);
    const existingFiles = new Set(this.uploadedFiles.map(file => `${file.name}-${file.size}`));

    this.duplicateFiles = []; // Reset duplicates list
    this.filteredNewFiles = []; // Store valid files for later

    fileArray.forEach(file => {
      const fileKey = `${file.name}-${file.size}`;
      if (existingFiles.has(fileKey)) {
        this.duplicateFiles.push(file.name); // Store duplicate names
      } else {
        this.filteredNewFiles.push(file); // Store valid files
      }
    });

    if (this.uploadedFiles.length + fileArray.length > 200) {
      this.fileError = 'You can upload up to 200 resumes only.';
      return;
    }

    this.fileError = null;

    if (this.duplicateFiles.length > 0) {
      this.limitedDuplicates = this.duplicateFiles.slice(0, 5);
      this.openDuplicateModal();
    } else {

      this.uploadedFiles.push(...this.filteredNewFiles);
      this.emitFileChanges();
    }
  }


  openDuplicateModal(): void {
    this.successTitle = "Duplicate Files";
    this.modalTitle = "Duplicate Files Detected";
    this.modalMessage = `The following files are already uploaded:`;
    this.showModal = ModalType.SUCCESS_MESSAGE;
    this.openModal(ModalType.SUCCESS_MESSAGE);
  }

  handleModalAction(action: string): void {
    if (action === 'reselect') {
      // 🔹 Clear uploaded files & reset file input
      this.uploadedFiles = [];
      this.filteredNewFiles = [];
      this.duplicateFiles = [];
      this.limitedDuplicates = [];

      const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ''; // Reset input so same files can be reselected
      }

      this.emitFileChanges();
    } else if (action === 'continue') {
      // Add valid files (ignoring duplicates)
      this.uploadedFiles.push(...this.filteredNewFiles);
      this.emitFileChanges();
    }

    this.closeModal();
    this.showModal = undefined; // Close modal
  }


  emitFileChanges(): void {
    this.uploadedFilesChange.emit(this.uploadedFiles);
    this.resumeUploadChange.emit(this.uploadedFiles.length > 0);
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    this.emitFileChanges();
  }

  /**
   * openModal
   *
   * A global modal method that open
   *
   * @param modalType - The type of modal to open.
   * @param message - The message to display in the modal.
   * @param title - The title to display in the modal.
   */
  openModal(modalType: ModalType, message: string = "", title: string = ""): void {
    this.showModal = modalType;

    // Strongly typed modal configuration
    const modalConfig: Partial<Record<ModalType, { size: string; close: boolean }>> = {
      [this.modalType.SHOW_MORE_DETAILS]: { size: "lg", close: true },
      [this.modalType.VIEW_CV]: { size: "xl", close: true },
      [this.modalType.REJECTED_REQUEST]: { size: "md", close: true }
    };

    // Fallback configuration for undefined modal types
    const config = modalConfig[modalType] || { size: "md", close: false };

    this.modalSize = config.size;
    this.showClose = config.close;

    this.cdr.detectChanges();

    this.modalMessage = message;
    this.modalTitle = title;
    this.modal.open();
  }

  // Closes the currently opened modal
  closeModal(): void {
    this.modal.cancel();
  }


}
