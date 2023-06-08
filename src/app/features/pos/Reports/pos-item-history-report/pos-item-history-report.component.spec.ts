import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosItemHistoryReportComponent } from './pos-item-history-report.component';

describe('PosItemHistoryReportComponent', () => {
    let component: PosItemHistoryReportComponent;
    let fixture: ComponentFixture<PosItemHistoryReportComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PosItemHistoryReportComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PosItemHistoryReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
