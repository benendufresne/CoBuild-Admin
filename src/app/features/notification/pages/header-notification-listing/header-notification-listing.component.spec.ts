import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNotificationListingComponent } from './header-notification-listing.component';

describe('HeaderNotificationListingComponent', () => {
  let component: HeaderNotificationListingComponent;
  let fixture: ComponentFixture<HeaderNotificationListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNotificationListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderNotificationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
