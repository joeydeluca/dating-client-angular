import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../models/User";
import {ValidationService} from "../services/validation.service";
import {UserService} from "../services/user.service";
import {MdSnackBar} from "@angular/material";
import {Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = new User();
  joinForm: any;
  genders = ["Man", "Woman"];
  submitting: boolean;
  showLoader: boolean;

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
      this.showLoader = true;
      this.user = this.joinForm.value;
      this.userService.createUser(this.user)
        .subscribe(
        (result) => {
          this.submitting = false;
          this.showLoader = false;
          this.router.navigate(['/join-completion']);
        },
        (error) => {
          this.submitting = false;
          this.showLoader = false;
          this.snackBar.open(error, null, {
            duration: 4000,
            extraClasses: ['bg-danger', 'snackbar']
          });
        }
      );
    }
  }
}
