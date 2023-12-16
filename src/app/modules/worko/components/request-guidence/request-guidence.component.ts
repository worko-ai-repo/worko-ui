import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-request-guidence',
  templateUrl: './request-guidence.component.html',
  styleUrls: ['./request-guidence.component.scss'],
  
  
})
export class RequestGuidenceComponent {
  @ViewChild('largeModal') largeModal!: ElementRef;
  isDivOpen:boolean=true;
  reqGuidenceArray:any[]=[];
  isDivShow:boolean= true
  selectedService: string = '';
  serviceButtonHide : boolean = true;
  isFormVisible: boolean = false;


  selectService(service: string) {
    this.selectedService = service;
    this.isFormVisible = true;

  }
  openLargeModal() {
    // Using nativeElement to access the underlying HTML element
    this.largeModal.nativeElement.classList.add('show');
    this.largeModal.nativeElement.style.display = 'block';
  }
  closeLargeModal() {
    this.largeModal.nativeElement.classList.remove('show');
    this.largeModal.nativeElement.style.display = 'none';
  }



 


 }
