import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompanyListingComponent } from './admin-company-listing.component';

describe('AdminCompanyListingComponent', () => {
  let component: AdminCompanyListingComponent;
  let fixture: ComponentFixture<AdminCompanyListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCompanyListingComponent]
    });
    fixture = TestBed.createComponent(AdminCompanyListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
