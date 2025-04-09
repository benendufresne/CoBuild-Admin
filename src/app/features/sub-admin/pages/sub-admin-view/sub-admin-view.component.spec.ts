import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAdminViewComponent } from './sub-admin-view.component';

describe('SubAdminViewComponent', () => {
  let component: SubAdminViewComponent;
  let fixture: ComponentFixture<SubAdminViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SubAdminViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubAdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
