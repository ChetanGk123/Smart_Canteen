import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMembershipReceiptComponent } from './new-membership-receipt.component';

describe('NewMembershipReceiptComponent', () => {
  let component: NewMembershipReceiptComponent;
  let fixture: ComponentFixture<NewMembershipReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMembershipReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMembershipReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
