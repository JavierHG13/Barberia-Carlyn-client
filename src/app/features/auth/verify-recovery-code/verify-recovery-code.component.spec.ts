import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyRecoveryCodeComponent } from './verify-recovery-code.component';

describe('VerifyRecoveryCodeComponent', () => {
  let component: VerifyRecoveryCodeComponent;
  let fixture: ComponentFixture<VerifyRecoveryCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyRecoveryCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyRecoveryCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
