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
import {MultiselectDropdownModule} from "angular-2-dropdown-multiselect";
import {AuthService} from "./services/auth.service";
import {MyDatePickerModule} from "mydatepicker";
import {JoinUploadPhotoComponent} from "./join-upload-photo/join-upload-photo.component";
import {SearchComponent} from "./search/search.component";

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    JoinCompletionComponent,
    JoinUploadPhotoComponent,
    SearchComponent,
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
    MultiselectDropdownModule,
    MyDatePickerModule,
    NgbModule.forRoot()
  ],
  providers: [
    ValidationService,
    UserService,
    LocationService,
    ProfileFieldService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
