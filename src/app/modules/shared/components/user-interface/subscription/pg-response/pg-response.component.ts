import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pg-response',
  templateUrl: './pg-response.component.html',
  styleUrls: ['./pg-response.component.scss']
})
export class PgResponseComponent {
  pgProvider: string | null = ''; // Property to store the route parameter

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Retrieving the 'pgProvider' parameter from the route
    this.pgProvider = this.route.snapshot.paramMap.get('pgProvider');

    // Checking if `pgProvider` is 'Billdesk' and close the window if true
    if (this.pgProvider === 'BILL_DESK') {
      window.close(); // Close the current window or tab
    }
  }

}
