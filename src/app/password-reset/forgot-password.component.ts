import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../models/User";
import {ValidationService} from "../services/validation.service";
import {SupportService} from "../services/support.service";
import {AuthService} from "../services/auth.service";
import {MatSnackBar} from "@angular/material";
import {Router, ActivatedRoute} from "@angular/router";
import {SharedService} from "../services/shared.service";
import {finalize} from "rxjs/operators";



@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  form: any;

  constructor(private fb: FormBuilder,
              private supportService: SupportService,
              private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      'email': ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    SharedService.showLoader.next(true);

    this.supportService.sendPasswordResetLink(this.form.value.email)
    .pipe(finalize(() => SharedService.showLoader.next(false)))
    .subscribe(
      () => {
        this.snackBar.open('Please check your email for reset link', null, {
            duration: 5000,
            panelClass: ['bg-success', 'snackbar']
        });
      }, 
      () => {
        this.snackBar.open('Server error, please try again later', null, {
            duration: 5000,
            panelClass: ['bg-danger', 'snackbar']
        });
      }
    );
  }
}
