import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {User} from "../models/User";
import {FormUtil} from "../utils/form.util";

export class JoinForm {
  submitted: boolean;

  private formGroup: FormGroup;
  private formUtil: FormUtil;

  constructor(private formBuilder: FormBuilder, private user: User) {
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      'email': [this.user.email, [
        Validators.required,
        Validators.maxLength(5)
      ]],
      'username': [this.user.username, [
        Validators.required,
        Validators.maxLength(5)
      ]]
    });

    this.formUtil = new FormUtil(this.formGroup);

    this.formGroup.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  isValid(): boolean {
    this.submitted = true;
    this.onValueChanged();
    this.submitted = false;
    return this.formGroup.valid
  }

  onValueChanged(data?: any) {
    this.formUtil.onValueChanged(this.formErrors, this.validationMessages, this.submitted, data);
  }

  formErrors = {
    'email': '',
    'username': ''
  };

  validationMessages = {
    'email': {
      'required':      ['VALIDATION.REQUIRED', 'Email'],
      'maxlength':     ['VALIDATION.MAX-LENGTH', 255]
    },
    'username': {
      'required':      ['VALIDATION.REQUIRED', 'Username'],
      'maxlength':     ['VALIDATION.MAX-LENGTH', 255]
    },
  };

}
