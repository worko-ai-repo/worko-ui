import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicSidebarComponent } from './public-sidebar.component';

describe('PublicSidebarComponent', () => {
  let component: PublicSidebarComponent;
  let fixture: ComponentFixture<PublicSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicSidebarComponent]
    });
    fixture = TestBed.createComponent(PublicSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
