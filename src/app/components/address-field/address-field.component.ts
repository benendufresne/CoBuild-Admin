import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NUMBER_CONST } from 'src/app/constants/number';
import { PreventKeysDirective } from 'src/app/directives/prevent-keys/prevent-keys.directive';
import { GoogleService, Maps } from 'src/app/services/google/google.service';
const MODULES =[
  MatFormFieldModule,
  MatInputModule,
  PreventKeysDirective,
  FormsModule,
  ReactiveFormsModule

]
@Component({
  selector: 'app-address-field',
  standalone: true,
  imports: [CommonModule,...MODULES],
  templateUrl: './address-field.component.html',
  styleUrl: './address-field.component.scss'
})
export class AddressFieldComponent implements AfterViewInit {
    @ViewChild("search") public searchElementRef: ElementRef;
    public formattedAddress: string;
    public numberConst = NUMBER_CONST;
    @Input() label = 'Address';
    @Input() placeHolder;

    @Input() set controlName(data: FormControl | AbstractControl) {
      if (data) {
        this.inputFormControl = data;
      }
    }
    inputFormControl!: FormControl | AbstractControl;
    @Input() longitude: FormControl | AbstractControl;
    @Input() latitude: FormControl | AbstractControl;
    public errMessage = 'Please select a valid address.'
constructor(
      private readonly _googleService: GoogleService,
      private ngZone: NgZone,
){

}
ngAfterViewInit(): void {
  setTimeout(() => {
    this._googleService.api.then((maps) => {
      this.initAutocomplete(maps);
    });
  }, 2000);
}
  initAutocomplete(maps: Maps) {
    try {
      let autocomplete = new maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          const selectedlocation = autocomplete.getPlace();
          this.formattedAddress = selectedlocation.formatted_address;
          this.inputFormControl.setValue(
            selectedlocation.formatted_address
          );
          this.latitude.setValue(
            selectedlocation.geometry.location.lat()
          );
          this.longitude.setValue(
            selectedlocation.geometry.location.lng()
          );
        });
      });
    } catch (error) {}
  }
  onAddressBlur(): void {
    setTimeout(() => {
      if (
        this.inputFormControl?.value != this.formattedAddress
      ) {
        // this.inputFormControl.setValue("");
        // this.latitude.setValue("");
        // this.longitude.setValue("");
        // this.ngZone.run(() => {});
      }
    }, 200);
  }
  onInput(): void {
    this.latitude.setValue("");
    this.longitude.setValue("");
  }
}
