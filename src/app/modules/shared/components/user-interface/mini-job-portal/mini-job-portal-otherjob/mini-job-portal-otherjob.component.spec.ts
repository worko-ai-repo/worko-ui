import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniJobPortalOtherjobComponent } from './mini-job-portal-otherjob.component';

describe('MiniJobPortalOtherjobComponent', () => {
  let component: MiniJobPortalOtherjobComponent;
  let fixture: ComponentFixture<MiniJobPortalOtherjobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiniJobPortalOtherjobComponent]
    });
    fixture = TestBed.createComponent(MiniJobPortalOtherjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
