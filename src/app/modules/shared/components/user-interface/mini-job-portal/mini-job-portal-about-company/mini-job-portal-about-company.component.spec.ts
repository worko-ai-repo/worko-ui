import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniJobPortalAboutCompanyComponent } from './mini-job-portal-about-company.component';

describe('MiniJobPortalAboutCompanyComponent', () => {
  let component: MiniJobPortalAboutCompanyComponent;
  let fixture: ComponentFixture<MiniJobPortalAboutCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiniJobPortalAboutCompanyComponent]
    });
    fixture = TestBed.createComponent(MiniJobPortalAboutCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
