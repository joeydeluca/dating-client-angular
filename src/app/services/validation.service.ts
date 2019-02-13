export class ValidationService {

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
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
    return control.value ? null : { 'required': true };
  }

  static birthdayValidator(control) {
    const input = control.value.date;

    const date = new Date(input);
    if (!date) {
      return { 'invalidBirthdayFormat': true };
    }

    return null;
  }

  private isDate(date: Date): boolean {
    return (date !== <any>'Invalid Date') && !isNaN(<any>date);
  }

}
