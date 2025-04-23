import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusUpdateDropdownComponent } from './status-update-dropdown.component';

describe('StatusUpdateDropdownComponent', () => {
  let component: StatusUpdateDropdownComponent;
  let fixture: ComponentFixture<StatusUpdateDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusUpdateDropdownComponent]
    });
    fixture = TestBed.createComponent(StatusUpdateDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
