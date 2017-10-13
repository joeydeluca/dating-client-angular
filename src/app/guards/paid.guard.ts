import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {MdSnackBar} from "@angular/material";


@Injectable()
export class PaidGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private snackBar: MdSnackBar) { }

  canActivate() {
    if(this.authService.getAuthContext().paid) {
      return true;
    }

    this.snackBar.open('This feature requires an upgraded membership', null, {
            duration: 4000,
            extraClasses: ['bg-warning', 'snackbar']
    });

    this.router.navigate(['/upgrade']);

    return false;
  }
}