import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CandidateDropdownService {
  private selectedStatusSubject = new BehaviorSubject<string>('awaiting');
  selectedStatus$ = this.selectedStatusSubject.asObservable();

  updateSelectedStatus(status: string) {
    this.selectedStatusSubject.next(status);
  }

  constructor() { }
}
