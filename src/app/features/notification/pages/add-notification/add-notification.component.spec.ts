import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotificationComponent } from './add-notification.component';

describe('AddNotificationComponent', () => {
  let component: AddNotificationComponent;
  let fixture: ComponentFixture<AddNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AddNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
