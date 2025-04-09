import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRenderComponent } from './search-render.component';

describe('SearchRenderComponent', () => {
  let component: SearchRenderComponent;
  let fixture: ComponentFixture<SearchRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SearchRenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
