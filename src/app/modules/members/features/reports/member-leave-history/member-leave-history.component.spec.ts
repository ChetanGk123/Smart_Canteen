import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberLeaveHistoryComponent } from './member-leave-history.component';

describe('MemberLeaveHistoryComponent', () => {
    let component: MemberLeaveHistoryComponent;
    let fixture: ComponentFixture<MemberLeaveHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MemberLeaveHistoryComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MemberLeaveHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
