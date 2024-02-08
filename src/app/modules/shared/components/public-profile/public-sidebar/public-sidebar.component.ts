import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-public-sidebar',
  templateUrl: './public-sidebar.component.html',
  styleUrls: ['./public-sidebar.component.scss']
})
export class PublicSidebarComponent {
  @Input() publicUserDetails:any="";
  @Input()publicUserExperienceDetails:any="";
  @Input()publicUserSocialDetails:any="";
}
