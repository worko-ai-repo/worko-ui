import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menubar',
  templateUrl: './user-menubar.component.html',
  styleUrls: ['./user-menubar.component.scss']
})
export class UserMenubarComponent {
  @Input() isSidebarExpanded:boolean = true;
  @Output() onToggleSidebar: EventEmitter<void> = new EventEmitter<void>();

  // iconChevronLeft: IconDefinition = faChevronLeft;
  // iconChevronRight: IconDefinition = faChevronRight;
  panelOpenState = false;
  isFilesCollapsed: boolean = true;
  activeRoute: string = '';

  /**
   * SidebarComponent constructor.
   *
   * @param {Router} router
   */
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.activeRoute = this.router.url;
  }

  /**
   * Toggle sidebar.
   *
   * @returns {void}
   */
  toggleSidebar(): void {
    this.onToggleSidebar.emit();
  }
}
