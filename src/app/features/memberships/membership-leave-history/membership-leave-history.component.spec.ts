import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipLeaveHistoryComponent } from './membership-leave-history.component';

describe('MembershipLeaveHistoryComponent', () => {
  let component: MembershipLeaveHistoryComponent;
  let fixture: ComponentFixture<MembershipLeaveHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipLeaveHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipLeaveHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
