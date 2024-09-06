import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniJobPortalCompaniesComponent } from './mini-job-portal-companies.component';

describe('MiniJobPortalCompaniesComponent', () => {
  let component: MiniJobPortalCompaniesComponent;
  let fixture: ComponentFixture<MiniJobPortalCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiniJobPortalCompaniesComponent]
    });
    fixture = TestBed.createComponent(MiniJobPortalCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
