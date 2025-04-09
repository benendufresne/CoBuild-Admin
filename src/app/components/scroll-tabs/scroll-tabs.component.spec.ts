import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollTabsComponent } from './scroll-tabs.component';

describe('ScrollTabsComponent', () => {
  let component: ScrollTabsComponent;
  let fixture: ComponentFixture<ScrollTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ScrollTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
