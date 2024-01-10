import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePackageComponent } from './service-package.component';

describe('ServicePackageComponent', () => {
  let component: ServicePackageComponent;
  let fixture: ComponentFixture<ServicePackageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicePackageComponent]
    });
    fixture = TestBed.createComponent(ServicePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
