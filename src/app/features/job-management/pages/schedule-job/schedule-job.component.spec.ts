import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleJobComponent } from './schedule-job.component';

describe('ScheduleJobComponent', () => {
  let component: ScheduleJobComponent;
  let fixture: ComponentFixture<ScheduleJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleJobComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
