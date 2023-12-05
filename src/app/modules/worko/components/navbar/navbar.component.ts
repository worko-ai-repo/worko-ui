import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  isDivOpen: boolean = false;

  toggleDiv() {
    this.isDivOpen = true;
  }


}
