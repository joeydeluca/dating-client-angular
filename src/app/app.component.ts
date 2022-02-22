import { Component, OnInit, HostBinding } from '@angular/core';
import {NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {SharedService} from './services/shared.service';
import {UserService} from './services/user.service';
import {AuthService} from './services/auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  showLoader = false;

  public get childRouteTransition() { return this.activatedRoute.snapshot; }

  constructor(public activatedRoute: ActivatedRoute, private userService: UserService, private authService: AuthService) {
    SharedService.showLoader
    .subscribe(val => this.showLoader = val);
  }

  ngOnInit() {
    if (!this.authService.getAuthContext()) return;

    this.userService.isPaid().subscribe((isPaid: boolean) => {
      if (isPaid) {
        this.authService.refreshContext().subscribe();
        this.userService.getUserFromServer().subscribe();
        SharedService.showUpgradeButton.next(false);
      }
    })
  }

}
