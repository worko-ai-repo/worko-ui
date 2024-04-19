import { Component } from '@angular/core';
import { CognitoService } from 'src/app/modules/services/cognito.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})

export class AddCompanyComponent {
  userLoggedIn: boolean = false;

  constructor(private cognitoService: CognitoService){}

  async ngOnInit(): Promise<void> {
    this.userLoggedIn = await this.cognitoService.isLoggedIn();
  }
}
