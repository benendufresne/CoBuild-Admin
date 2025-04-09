import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsDamageComponent } from './incidents-damage.component';

describe('IncidentsDamageComponent', () => {
  let component: IncidentsDamageComponent;
  let fixture: ComponentFixture<IncidentsDamageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentsDamageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncidentsDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
