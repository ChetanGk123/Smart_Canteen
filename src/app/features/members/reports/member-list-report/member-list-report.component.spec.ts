import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberListReportComponent } from './member-list-report.component';

describe('MemberListReportComponent', () => {
    let component: MemberListReportComponent;
    let fixture: ComponentFixture<MemberListReportComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MemberListReportComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MemberListReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
