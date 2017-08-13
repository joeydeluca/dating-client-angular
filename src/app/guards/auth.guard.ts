import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    if(!!this.authService.getAuthContext()) {
      return true;
    }

    console.info('Login required. Redirecting to login page.');
    this.router.navigate(['/login']);
    return false;
  }
}