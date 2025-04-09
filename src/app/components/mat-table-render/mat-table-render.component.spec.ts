import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MatTableRenderComponent } from "./mat-table-render.component";

describe("MatTableRenderComponent", () => {
  let component: MatTableRenderComponent;
  let fixture: ComponentFixture<MatTableRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTableRenderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatTableRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
