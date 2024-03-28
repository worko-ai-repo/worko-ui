import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoService } from 'src/app/modules/services/cognito.service';
import { StorageService } from 'src/app/modules/app-core/services/storage.service';

@Component({
  selector: 'app-worko-auth',
  templateUrl: './worko-auth.component.html',
  styleUrls: ['./worko-auth.component.scss']
})
export class WorkoAuthComponent {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cognitoService: CognitoService,
    private storage: StorageService,

  ) { }

  /**
 * Logout.
 *
 * @returns {Promise<void>}
 */
  async logout(): Promise<void> {
    try {
      await this.cognitoService.handleSignOut();
      // After successful logout, navigate to the landing page route
      this.router.navigate(['/']);

    } catch (error) {
      console.error(error);
    }
  }
}
