import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddEditComponent } from "./add-edit.component";

describe("AddEditComponent", () => {
  let component: AddEditComponent;
  let fixture: ComponentFixture<AddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
