import {Injectable} from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {environment} from '../../environments/environment';

@Injectable()
export class DiscourseSSOGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const authContext = this.authService.getAuthContext();

    if (!authContext) {
      return true;
    }

    // If user is already logged in
    if (new URLSearchParams(window.location.search).get('sso')) {
      console.info('Redirecting to Discourse');
      window.location.href = environment.apiUrl + `/sso/discourse-callback/${window.location.search}&token=${authContext.token}`;
    }

    return false;
  }
}
