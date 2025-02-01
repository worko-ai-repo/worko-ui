import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';

import { AdminService } from '../../services/admin.service';

// Shared components like spinner ,modals and etcetras.
import { MatSort } from "@angular/material/sort";
import { ModalType } from "src/app/modules/shared/interfaces/shared.interface";
import { MatPaginator } from "@angular/material/paginator";
import { ModalComponent } from "src/app/modules/shared/components/modal/modal.component";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material/table";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";


// Interface for FetchJobsOptionsDto
interface FetchJobsOptionsDto {
  corporateUserType?: any;
  inviteStatus?: string;
  firstName?: string;
  searchText?: string;
  pageSize?: number;
  sortOrder?: string;
  resetPagination?: boolean;
}

@Component({
  selector: 'app-admin-company',
  templateUrl: './admin-company.component.html',
  styleUrls: ['./admin-company.component.scss']
})
export class AdminCompanyComponent implements OnInit {
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  
}
