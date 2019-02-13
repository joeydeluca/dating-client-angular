import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../models/User";
import {ValidationService} from "../services/validation.service";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";
import {MatSnackBar} from "@angular/material";
import {Router, ActivatedRoute} from "@angular/router";
import {SharedService} from "../services/shared.service";


@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: any;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute,) {
    this.form = this.fb.group({
      'email': ['', [Validators.required]],
      'password': ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    SharedService.showLoader.next(true);

    this.authService.login(this.form.value.email, this.form.value.password).subscribe(
      () => {
        SharedService.showLoader.next(false);

        const redirectUrl = this.route.snapshot.queryParams['redirect'] || '/search';
        console.log(redirectUrl);
        //this.router.navigate([redirectUrl]);
        this.router.navigateByUrl(redirectUrl);
      }, 
      () => {
        SharedService.showLoader.next(false);
        this.snackBar.open('Invalid username or password', null, {
            duration: 5000,
            panelClass: ['bg-danger', 'snackbar']
          });
      }
    );
  }
}
