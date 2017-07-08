import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {LandingComponent} from "./landing/landing.component";
import {ControlMessages} from "./common/control-messages.component";
import {ValidationService} from "./services/validation.service";

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ControlMessages
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [ValidationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
