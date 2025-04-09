import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCmsComponent } from './public-cms.component';

describe('PublicCmsComponent', () => {
  let component: PublicCmsComponent;
  let fixture: ComponentFixture<PublicCmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicCmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
