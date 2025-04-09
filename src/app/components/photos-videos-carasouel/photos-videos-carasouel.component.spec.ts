import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosVideosCarasouelComponent } from './photos-videos-carasouel.component';

describe('PhotosVideosCarasouelComponent', () => {
  let component: PhotosVideosCarasouelComponent;
  let fixture: ComponentFixture<PhotosVideosCarasouelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosVideosCarasouelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhotosVideosCarasouelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
