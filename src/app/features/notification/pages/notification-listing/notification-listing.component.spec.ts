import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationListingComponent } from './notification-listing.component';

describe('NotificationListingComponent', () => {
  let component: NotificationListingComponent;
  let fixture: ComponentFixture<NotificationListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NotificationListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
