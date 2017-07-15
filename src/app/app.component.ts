import { Component } from '@angular/core';
import {NgbDatepickerConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(datepickerConfig: NgbDatepickerConfig) {
    datepickerConfig.minDate = {year: 1920, month: 1, day: 1};
    datepickerConfig.maxDate = {year: new Date().getFullYear() - 18, month: 12, day: 31};

  }
}
