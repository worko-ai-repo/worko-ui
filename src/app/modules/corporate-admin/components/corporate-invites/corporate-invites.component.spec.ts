import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateInvitesComponent } from './corporate-invites.component';

describe('CorporateInvitesComponent', () => {
  let component: CorporateInvitesComponent;
  let fixture: ComponentFixture<CorporateInvitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateInvitesComponent]
    });
    fixture = TestBed.createComponent(CorporateInvitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
