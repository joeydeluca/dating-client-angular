export class ValidationService {

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      'required': 'Required',
      'invalidEmailAddress': 'Invalid email address',
      'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      'minlength': `Minimum length ${validatorValue.requiredLength}`,
      'maxlength': `Maximum length ${validatorValue.requiredLength}`,
      'invalidBirthday': 'Minimum age is 18',
      'invalidBirthdayFormat': 'Date must be in yyyy-mm-dd format'
    };

    return config[validatorName];
  }

  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }

  static checkboxValidator(control) {
    return control.value ? null : { "required": true };
  }

  static birthdayValidator(control) {
    const input = control.value;
    if(!input || !input.year || !input.month || !input.day) {
      return { 'invalidBirthdayFormat': true };
    }

    const minimumYear = new Date().getFullYear() - 18;

    if(input.year > minimumYear) {
      return { 'invalidBirthday': true };
    }

    return null;
  }

}
