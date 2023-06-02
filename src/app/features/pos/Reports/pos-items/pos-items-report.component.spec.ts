import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosItemsReportComponent } from './pos-items-report.component';

describe('PosItemsReportComponent', () => {
  let component: PosItemsReportComponent;
  let fixture: ComponentFixture<PosItemsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosItemsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosItemsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
