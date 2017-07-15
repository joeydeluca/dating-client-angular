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
import {UserService} from "./services/user.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MdProgressBarModule, MdSnackBarModule} from "@angular/material";
import {JoinCompletionComponent} from "./join-completion/join-completion.component";
import {LocationService} from "./services/location.service";
import {RecaptchaModule} from "ng-recaptcha";
import {RecaptchaFormsModule} from "ng-recaptcha/recaptcha/recaptcha-forms.module";
import {ProfileFieldService} from "./services/profile-field.service";

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    JoinCompletionComponent,
    ControlMessages
  ],
  imports: [
    AppRoutingModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MdProgressBarModule,
    MdSnackBarModule,
    NgbModule.forRoot()
  ],
  providers: [ValidationService, UserService, LocationService, ProfileFieldService],
  bootstrap: [AppComponent]
})
export class AppModule { }
