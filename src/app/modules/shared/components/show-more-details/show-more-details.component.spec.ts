import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMoreDetailsComponent } from './show-more-details.component';

describe('ShowMoreDetailsComponent', () => {
  let component: ShowMoreDetailsComponent;
  let fixture: ComponentFixture<ShowMoreDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowMoreDetailsComponent]
    });
    fixture = TestBed.createComponent(ShowMoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
