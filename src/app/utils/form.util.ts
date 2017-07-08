import {FormGroup} from "@angular/forms";
import {TranslateUtil} from "./translate.util";
export class FormUtil {

  constructor(private formGroup: FormGroup) {}

  onValueChanged(formErrors: Object, validationMessages: Object, submitted: boolean, data?: any) {
    if (!this.formGroup) { return; }
    const form = this.formGroup;

    for (const field in formErrors) {
      // clear previous error message (if any)
      formErrors[field] = '';
      const control = form.get(field);

      if ((control && control.dirty && !control.valid) || submitted ) {
        const messages = validationMessages[field];
        for (const key in control.errors) {
          formErrors[field] += TranslateUtil.getEnText(messages[key][0], messages[key][1]) + ' ';
        }
      }
    }
  }
}
