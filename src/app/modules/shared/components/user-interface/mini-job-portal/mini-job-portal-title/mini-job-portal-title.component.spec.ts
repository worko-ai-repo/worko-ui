import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniJobPortalTitleComponent } from './mini-job-portal-title.component';

describe('MiniJobPortalTitleComponent', () => {
  let component: MiniJobPortalTitleComponent;
  let fixture: ComponentFixture<MiniJobPortalTitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiniJobPortalTitleComponent]
    });
    fixture = TestBed.createComponent(MiniJobPortalTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
