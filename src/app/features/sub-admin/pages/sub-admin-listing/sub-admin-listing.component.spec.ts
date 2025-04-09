import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAdminListingComponent } from './sub-admin-listing.component';

describe('SubAdminListingComponent', () => {
  let component: SubAdminListingComponent;
  let fixture: ComponentFixture<SubAdminListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SubAdminListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubAdminListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
