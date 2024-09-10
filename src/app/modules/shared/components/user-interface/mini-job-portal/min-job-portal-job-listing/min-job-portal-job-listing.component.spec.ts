import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinJobPortalJobListingComponent } from './min-job-portal-job-listing.component';

describe('MinJobPortalJobListingComponent', () => {
  let component: MinJobPortalJobListingComponent;
  let fixture: ComponentFixture<MinJobPortalJobListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinJobPortalJobListingComponent]
    });
    fixture = TestBed.createComponent(MinJobPortalJobListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
