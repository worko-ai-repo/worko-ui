import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniJobPortalJobListingComponent } from './mini-job-portal-job-listing.component';

describe('MiniJobPortalJobListingComponent', () => {
  let component: MiniJobPortalJobListingComponent;
  let fixture: ComponentFixture<MiniJobPortalJobListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiniJobPortalJobListingComponent]
    });
    fixture = TestBed.createComponent(MiniJobPortalJobListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
