import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {LandingComponent} from './landing/landing.component';
import {ControlMessages} from './common/control-messages.component';
import {ValidationService} from './services/validation.service';
import {UserService} from './services/user.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressBarModule, MatSnackBarModule, MatDialogModule} from '@angular/material';
import {JoinCompletionComponent} from './join-completion/join-completion.component';
import {LocationService} from './services/location.service';
import {RecaptchaModule} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';
import {ProfileFieldService} from './services/profile-field.service';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {AuthService} from './services/auth.service';
import {PhotoService} from './services/photo.service';
import {SharedService} from './services/shared.service';
import {PaymentService} from './services/payment.service';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {JoinUploadPhotoComponent} from './join-upload-photo/join-upload-photo.component';
import {SearchComponent} from './search/search.component';
import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './password-reset/forgot-password.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {MessagesComponent} from './messages/messages.component';
import {ViewConversationComponent} from './messages/view-conversation.component';
import {ViewProfileComponent} from './view-profile/view-profile.component';
import {UpdateProfileComponent} from './update-profile/update-profile.component';
import {AuthGuard} from './guards/auth.guard';
import {PaidGuard} from './guards/paid.guard';
import {NonMemberGuard} from './guards/nonmember.guard';
import {DiscourseSSOGuard} from './guards/discourse-sso-redirect.guard';
import {LocationDisplayComponent} from './components/location-display.component';
import {FieldDisplayComponent} from './components/field-display.component';
import {FavoritesComponent} from './favorites/favorites.component';
import {RecipientProfileService} from './services/recipient-profile.service';
import {FlirtsComponent} from './flirts/flirts.component';
import {ProfileViewsComponent} from './profile-views/profile-views.component';
import {UpgradeComponent} from './upgrade/upgrade.component';
import {VerifyPaymentComponent} from './upgrade/verify-payment.component';
import {SettingsComponent} from './settings/settings.component';
import {SupportComponent} from './support/support.component';
import {SupportService} from './services/support.service';


import {ProfileListComponent} from './components/profile-list/profile-list.component';
import {DNavComponent} from './components/d-nav/d-nav.component';
import {DPhotoUploadComponent} from './components/d-photo-upload/d-photo-upload.component';

import {RoundPipe} from './pipes/round.pipe';
import { AdsenseModule } from 'ng2-adsense';
import { DocComponent } from './doc/doc.component';


//import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    JoinCompletionComponent,
    JoinUploadPhotoComponent,
    SearchComponent,
    LoginComponent,
    ForgotPasswordComponent,
    PasswordResetComponent,
    ControlMessages,
    ViewProfileComponent,
    UpdateProfileComponent,
    MessagesComponent,
    ViewConversationComponent,
    FavoritesComponent,
    FlirtsComponent,
    ProfileViewsComponent,
    UpgradeComponent,
    VerifyPaymentComponent,
    SettingsComponent,
    SupportComponent,

    LocationDisplayComponent,
    DNavComponent,
    FieldDisplayComponent,
    DPhotoUploadComponent,
    ProfileListComponent,

    RoundPipe,

    //MediaDialog,
    DocComponent
  ],
  imports: [
    AdsenseModule.forRoot({
      adClient: 'ca-pub-2476579159077839'
    }),
    AppRoutingModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MultiselectDropdownModule,
    AngularMyDatePickerModule,
    //FileUploadModule,
    MatDialogModule,
    NgbModule.forRoot()
  ],
  providers: [
    ValidationService,
    UserService,
    LocationService,
    ProfileFieldService,
    AuthService,
    AuthGuard,
    PaidGuard,
    NonMemberGuard,
    DiscourseSSOGuard,
    PhotoService,
    RecipientProfileService,
    PaymentService,
    SupportService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    //MediaDialog
  ]
})
export class AppModule { }
