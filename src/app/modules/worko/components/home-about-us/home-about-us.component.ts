import { Component, HostListener } from '@angular/core';

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

}
