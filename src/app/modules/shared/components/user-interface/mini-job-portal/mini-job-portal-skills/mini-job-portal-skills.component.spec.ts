import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniJobPortalSkillsComponent } from './mini-job-portal-skills.component';

describe('MiniJobPortalSkillsComponent', () => {
  let component: MiniJobPortalSkillsComponent;
  let fixture: ComponentFixture<MiniJobPortalSkillsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiniJobPortalSkillsComponent]
    });
    fixture = TestBed.createComponent(MiniJobPortalSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
