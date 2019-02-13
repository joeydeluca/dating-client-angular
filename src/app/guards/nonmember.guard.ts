import {Injectable} from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()
export class NonMemberGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.getAuthContext()) {
      return true;
    }

    console.info('Redirecting to member area');

    this.router.navigate(['/search']);

    return false;
  }
}
