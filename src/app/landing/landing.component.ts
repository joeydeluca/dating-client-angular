import {Component, OnInit, Input} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../models/User";
import {ValidationService} from "../services/validation.service";
import {UserService} from "../services/user.service";
import {MdSnackBar} from "@angular/material";
import {Router} from "@angular/router";
import {SharedService} from "../services/shared.service";

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  user = new User();
  joinForm: any;
  submitting: boolean;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private snackBar: MdSnackBar,
              private router: Router) {
    this.joinForm = this.fb.group({
      'gender': ['', [Validators.required]],
      'genderSeeking': ['', [Validators.required]],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'username': ['', [Validators.required, Validators.maxLength(12)]],
      'password': ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]]
    });
  }


  onSubmit() {
    if (this.joinForm.dirty && this.joinForm.valid) {
      SharedService.showLoader.next(true);
      this.user = this.joinForm.value;
      this.userService.createUser(this.user)
        .subscribe(
        (result) => {
          this.submitting = false;
          SharedService.showLoader.next(false);
          this.router.navigate(['/join-completion']);
        },
        (error) => {
          this.submitting = false;
          SharedService.showLoader.next(false);
          this.snackBar.open(error, null, {
            duration: 4000,
            extraClasses: ['bg-danger', 'snackbar']
          });
        }
      );
    }
  }
}
