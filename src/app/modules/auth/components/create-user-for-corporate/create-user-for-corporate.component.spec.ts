import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserForCorporateComponent } from './create-user-for-corporate.component';

describe('CreateUserForCorporateComponent', () => {
  let component: CreateUserForCorporateComponent;
  let fixture: ComponentFixture<CreateUserForCorporateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUserForCorporateComponent]
    });
    fixture = TestBed.createComponent(CreateUserForCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
