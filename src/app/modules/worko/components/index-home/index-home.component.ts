import { Component } from '@angular/core';
import { PopUpService } from '../../../services/pop-up.service';

@Component({
  selector: 'app-index-home',
  templateUrl: './index-home.component.html',
  styleUrls: ['./index-home.component.scss']
})
export class IndexHomeComponent {

  constructor(private PopUpService:PopUpService) {}

  showPopup() {
    this.PopUpService.showPopup();
  }
}
