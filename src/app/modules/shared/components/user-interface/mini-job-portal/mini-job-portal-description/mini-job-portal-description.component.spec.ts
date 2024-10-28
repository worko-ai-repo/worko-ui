import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniJobPortalDescriptionComponent } from './mini-job-portal-description.component';

describe('MiniJobPortalDescriptionComponent', () => {
  let component: MiniJobPortalDescriptionComponent;
  let fixture: ComponentFixture<MiniJobPortalDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiniJobPortalDescriptionComponent]
    });
    fixture = TestBed.createComponent(MiniJobPortalDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
