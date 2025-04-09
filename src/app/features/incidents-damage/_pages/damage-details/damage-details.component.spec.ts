import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageDetailsComponent } from './damage-details.component';

describe('DamageDetailsComponent', () => {
  let component: DamageDetailsComponent;
  let fixture: ComponentFixture<DamageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamageDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DamageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
