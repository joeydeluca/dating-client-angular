import {Injectable} from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!!this.authService.getAuthContext()) {
      return true;
    }

    console.info('Login required. Redirecting to login page.');

    this.router.navigate(['/login'], { queryParams: {redirect: state.url}});

    return false;
  }
}
