import { Component } from '@angular/core';


@Component({
  selector: 'app-package-form',
  templateUrl: './package-form.component.html',
  styleUrls: ['./package-form.component.scss']
})
export class PackageFormComponent {
 packageForm:any[]=[
  {sName:"Career Guidance", duration:"15 min", amount:"1000" },
  {sName:"Mock Interview", duration:"30 min", amount:"2000" },
  {sName:"Interview Guidance", duration:"30 min", amount:"3000" },
  {sName:"Resume Review", duration:"15 min", amount:"1000" }
 ];

 exampleHeader = "";
}
