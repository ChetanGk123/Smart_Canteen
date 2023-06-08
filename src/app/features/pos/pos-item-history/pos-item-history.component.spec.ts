import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosItemHistoryComponent } from './pos-item-history.component';

describe('PosItemHistoryComponent', () => {
    let component: PosItemHistoryComponent;
    let fixture: ComponentFixture<PosItemHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PosItemHistoryComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PosItemHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
