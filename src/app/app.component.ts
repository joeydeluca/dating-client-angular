import { Component, HostBinding } from '@angular/core';
import {NgbDatepickerConfig} from "@ng-bootstrap/ng-bootstrap";
import {SharedService} from "./services/shared.service";
import {fadeAnimation} from "./animations/fade.animation"
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent {

  showLoader: boolean = false;

  @HostBinding('@fadeAnimation')
  public get childRouteTransition() { return this.activatedRoute.snapshot; }

  constructor(public activatedRoute: ActivatedRoute ) {
    SharedService.showLoader
    .subscribe(val => this.showLoader = val);
  }
}
