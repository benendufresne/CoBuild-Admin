import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationQuickViewComponent } from './notification-quick-view.component';

describe('NotificationQuickViewComponent', () => {
  let component: NotificationQuickViewComponent;
  let fixture: ComponentFixture<NotificationQuickViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationQuickViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationQuickViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
