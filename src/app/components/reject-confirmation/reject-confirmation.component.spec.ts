import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectConfirmationComponent } from './reject-confirmation.component';

describe('RejectConfirmationComponent', () => {
  let component: RejectConfirmationComponent;
  let fixture: ComponentFixture<RejectConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RejectConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
