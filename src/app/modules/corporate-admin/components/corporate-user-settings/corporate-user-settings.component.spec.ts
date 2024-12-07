import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateUserSettingsComponent } from './corporate-user-settings.component';

describe('CorporateUserSettingsComponent', () => {
  let component: CorporateUserSettingsComponent;
  let fixture: ComponentFixture<CorporateUserSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporateUserSettingsComponent]
    });
    fixture = TestBed.createComponent(CorporateUserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
