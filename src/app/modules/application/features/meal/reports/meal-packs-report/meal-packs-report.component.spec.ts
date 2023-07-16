import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealPacksReportComponent } from './meal-packs-report.component';

describe('MealPacksReportComponent', () => {
  let component: MealPacksReportComponent;
  let fixture: ComponentFixture<MealPacksReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MealPacksReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MealPacksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
