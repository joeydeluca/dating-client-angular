import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../models/User";
import {ValidationService} from "../services/validation.service";
import {SupportService} from "../services/support.service";
import {AuthService} from "../services/auth.service";
import {MdSnackBar} from "@angular/material";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {SharedService} from "../services/shared.service";

@Component({
  selector: 'password-reset',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent implements OnInit {
  form: any;
  requestId: string;

  constructor(private fb: FormBuilder,
              private supportService: SupportService,
              private snackBar: MdSnackBar,
              private route: ActivatedRoute,
              private router: Router,) {
    this.form = this.fb.group({
      'password': ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.requestId = params['requestId'];

      if(!this.requestId) {
        this.showError('Invalid password reset link');
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit(): void {
    SharedService.showLoader.next(true);

    this.supportService.resetPassword(this.requestId, this.form.value.password)
    .finally(() => SharedService.showLoader.next(false))
    .subscribe(
      () => {
        this.snackBar.open('Password updated. Please enter your new password to login', null, {
            duration: 5000,
            extraClasses: ['bg-success', 'snackbar']
        });
        this.router.navigate(['/login']);
      }, 
      () => {
        this.showError('Server error, please try again later');
      }
    );
  }

  showError(msg) {
    this.snackBar.open(msg, null, {
      duration: 5000,
      extraClasses: ['bg-danger', 'snackbar']
    });
  }
}
