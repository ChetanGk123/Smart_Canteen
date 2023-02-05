import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteensComponent } from './canteens.component';

describe('CanteensComponent', () => {
  let component: CanteensComponent;
  let fixture: ComponentFixture<CanteensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanteensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanteensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
