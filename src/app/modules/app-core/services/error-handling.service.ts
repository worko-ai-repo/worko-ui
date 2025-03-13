import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private router: Router) { }

  handleApiError(error: any, showModalCallback?: () => void): void {
    if (error.status === 404) {
      this.router.navigate(['/auth/logout']);
      return;
    }

    if (error.status === 401) {
      // this.router.navigate(['/']);
      const baseUrl = window.location.origin; // gets "dev-ui.worko.work" or "worko.ai"
      window.location.href = `${baseUrl}/`;
      return;
    }

    // If the error is NOT 401 or 404, call the modal callback (if provided)
    if (showModalCallback) {
      showModalCallback();
    }
  }

}
