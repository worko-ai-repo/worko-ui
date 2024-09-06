import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniJobPortalComponent } from './mini-job-portal.component';

describe('MiniJobPortalComponent', () => {
  let component: MiniJobPortalComponent;
  let fixture: ComponentFixture<MiniJobPortalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiniJobPortalComponent]
    });
    fixture = TestBed.createComponent(MiniJobPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
