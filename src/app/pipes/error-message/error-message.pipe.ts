import { Pipe, PipeTransform } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { REGEX } from 'src/app/constants/validators';

@Pipe({
  name: 'errorMessage',
  standalone: true,
  pure: false
})
export class ErrorMessagePipe implements PipeTransform {
  transform(
    form: FormGroup | FormArray,
    control: string,
    label: string,
    index?: number,
    isTypeSelect: boolean = false,
    isPrice:boolean = false
  ): string {
    let controlToValidate;

    // Handle FormGroup and FormArray differently
    if (form instanceof FormArray && index !== undefined) {
      controlToValidate = form.at(index)?.get(control);
      
    } else if (form instanceof FormGroup) {
      controlToValidate = form.get(control);
    }
    if (controlToValidate?.touched || controlToValidate?.invalid) {
      const errors = controlToValidate?.errors;
      if (errors?.hasOwnProperty('required')) {
        const displayError = isPrice?`Please enter price for ${label}.`:`Please ${isTypeSelect ? 'select' : 'enter'} the ${label}.`
        return displayError;
      }    else if (errors?.hasOwnProperty('rankingError')) {
        return 'The current rank must be no less than or equal to the previous rank.';
      } 
      else if (errors?.hasOwnProperty('minlength')) {
        return `Minimum ${errors['minlength'].requiredLength} characters required.`;
      } else if (errors?.hasOwnProperty('maxlength')) {
        return `Maximum ${errors['maxlength'].requiredLength} characters required.`;
      } else if (errors?.hasOwnProperty('email')) {
        return `Invalid Email Address`;
      } else if (errors?.hasOwnProperty('min')) {
        return `${label} should be greater than ${errors['min'].min}`;
      } else if (errors?.hasOwnProperty('max')) {
        return `${label} should be less than ${errors['max'].max}`;
      } else if (errors?.hasOwnProperty('pattern')) {
        if (
          control === 'password' ||
          control === 'confirmPassword' ||
          control === 'oldPassword'
        ) {
          return `Invalid ${label}. ${label} must include 7 characters, at-least one upper case letter, one lower case letter and one numeric digit.`;
        } else {
          let pattern = errors['pattern'].requiredPattern;
          return this.PATTERN_ERRORS(pattern, label, isTypeSelect,isPrice);
        }
      } else if (errors?.hasOwnProperty('passwordNotMatch')) {
        return 'Password & Confirm Password do not match';
      }  else if (errors?.hasOwnProperty('incorrect')) {
        return 'Please enter a valid password.';
      } else if (errors?.hasOwnProperty('incorrect')) {
        return 'Please enter a valid password.';
      }else if (errors?.hasOwnProperty('emailNotRegisteredForLogin')) {
        return `Seems like the Email is not registered with us. Please try to login using another Email.`;
      }else if (errors?.hasOwnProperty('match')) {
        return `Your old password and new password do not same.`;
      }else if (errors?.hasOwnProperty('minFAQ')) {
        return `Minimum 3 characters required.`;
      }else if(errors?.hasOwnProperty('noSpace')){
        return 'Content cannot be empty. Please enter valid text.'
      }
      //  else if (errors?.hasOwnProperty('emailNotRegistered')) {
      //   return 'Seems like the Email is not registered with us. Please try setting your password using another Email.';
      // } 
      else if (errors?.hasOwnProperty('invalidPassword')) {
        return `Invalid email or password.`;
      }
    }
    return '';
  }

  PATTERN_ERRORS(pattern: any, key: string,  isTypeSelect: boolean = false,
    isPrice:boolean = false) {
    let comment: any;
    if (pattern == REGEX.EMAIL) {
      comment = `Please enter valid ${key}.`;
    } else if (pattern == REGEX.PASSWORD) {
      comment = `${key} can not contain blank spaces`;
    } else if (pattern == REGEX.NAME) {
      comment = `Please enter a valid ${key}`;
    } else if (pattern == REGEX.NUMBER) {
      comment = `${key} can contain only digits`;
    } else if (pattern == REGEX.ONLY_NUMBER) {
      comment = `${key} can contain only digits`;
    }else if (pattern == REGEX.ONLY_ALPHABET) {
      comment = `${key} can contain only alphabets`;
    }  else if (pattern == REGEX.ALPHABET_WITH_DIGITS) {
      comment = `Please enter a valid ${key}`;
    }
     else if (pattern == REGEX.MOBILE_NUMBER) {
      comment = `Invalid ${key}`;
    }  else if (pattern == REGEX.DESCRIPTION) {
      comment = `Double and trailing spaces are not allowed.`;
    } else if (pattern == REGEX.CATEGORY_URL){
      comment = `Characters allowed: (-, ',?, !)`;
    }else if (pattern == REGEX.CATEGORY_URL_DANISH){
      comment = `Characters allowed: (-, ',?, !, æ, ø, å).`;
    }else if (pattern == REGEX.PRICE){
      // comment = `Please enter a valid ${key}`;
      comment =isPrice?`Please enter a valid price for ${key}.`:`Please ${isTypeSelect ? 'enter' : 'select'} a valid ${key}`;

    }
    
    return comment;
  }
}
