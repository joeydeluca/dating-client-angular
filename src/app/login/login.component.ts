import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {User} from '../models/User';
import {ValidationService} from '../services/validation.service';
import {UserService} from '../services/user.service';
import {AuthService} from '../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router, ActivatedRoute} from '@angular/router';
import {SharedService} from '../services/shared.service';
import {environment} from '../../environments/environment';



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
              private route: ActivatedRoute, ) {
    this.form = this.fb.group({
      'email': ['', [Validators.required]],
      'password': ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    SharedService.showLoader.next(true);

    this.authService.login(this.form.value.email, this.form.value.password).subscribe(
      {
        complete: () => {
          SharedService.showLoader.next(false);

          if (this.route.snapshot.queryParams['sso']) {
            console.info('Redirecting to Discourse');
            window.location.href = environment.apiUrl + `/sso/discourse-callback/${window.location.search}&token=${this.authService.getAuthContext().token}`;
            return;
          }

          const redirectUrl = this.route.snapshot.queryParams['redirect'] || '/search';

          this.router.navigateByUrl(redirectUrl);
        },
        error: () => {
          SharedService.showLoader.next(false);
          this.snackBar.open('Invalid username or password', null, {
              duration: 5000,
              panelClass: ['bg-danger', 'snackbar']
            });
          }  
    });
  }
}
