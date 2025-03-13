import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {
  bgPlexus = 'assets/bg-plexus.png'; // Update path if needed

  constructor(private router: Router) {}

  goHome() {
    const baseUrl = window.location.origin; // Gets "dev-ui.worko.work" or "worko.ai"
    window.location.href = `${baseUrl}/`;
  }
}
