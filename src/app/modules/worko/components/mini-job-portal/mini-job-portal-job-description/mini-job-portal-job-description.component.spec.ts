import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniJobPortalJobDescriptionComponent } from './mini-job-portal-job-description.component';

describe('MiniJobPortalJobDescriptionComponent', () => {
  let component: MiniJobPortalJobDescriptionComponent;
  let fixture: ComponentFixture<MiniJobPortalJobDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiniJobPortalJobDescriptionComponent]
    });
    fixture = TestBed.createComponent(MiniJobPortalJobDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
