import { Component, HostBinding } from '@angular/core';
import {NgbDatepickerConfig} from "@ng-bootstrap/ng-bootstrap";
import {SharedService} from "./services/shared.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  showLoader: boolean = false;

  public get childRouteTransition() { return this.activatedRoute.snapshot; }

  constructor(public activatedRoute: ActivatedRoute ) {
    SharedService.showLoader
    .subscribe(val => this.showLoader = val);
  }
}
