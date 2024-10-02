import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinJobPortalJobListComponent } from './min-job-portal-job-list.component';

describe('MinJobPortalJobListComponent', () => {
  let component: MinJobPortalJobListComponent;
  let fixture: ComponentFixture<MinJobPortalJobListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinJobPortalJobListComponent]
    });
    fixture = TestBed.createComponent(MinJobPortalJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
