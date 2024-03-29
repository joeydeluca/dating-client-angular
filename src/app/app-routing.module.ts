import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {JoinCompletionComponent} from './join-completion/join-completion.component';
import {JoinUploadPhotoComponent} from './join-upload-photo/join-upload-photo.component';
import {SearchComponent} from './search/search.component';
import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './password-reset/forgot-password.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {ViewProfileComponent} from './view-profile/view-profile.component';
import {UpdateProfileComponent} from './update-profile/update-profile.component';
import {MessagesComponent} from './messages/messages.component';
import {ViewConversationComponent} from './messages/view-conversation.component';
import {FavoritesComponent} from './favorites/favorites.component';
import {FlirtsComponent} from './flirts/flirts.component';
import {ProfileViewsComponent} from './profile-views/profile-views.component';
import {UpgradeComponent} from './upgrade/upgrade.component';
import {VerifyPaymentComponent} from './upgrade/verify-payment.component';
import {SettingsComponent} from './settings/settings.component';
import {SupportComponent} from './support/support.component';

import {AuthGuard} from './guards/auth.guard';
import {PaidGuard} from './guards/paid.guard';
import {NonMemberGuard} from './guards/nonmember.guard';
import {DiscourseSSOGuard} from './guards/discourse-sso-redirect.guard';
import { DocComponent } from './doc/doc.component';

import {TestChatComponent} from './testchat/search.component';
import {FrendUpgradeComponent} from './frend-upgrade/upgrade.component';
import {FrendVerifyPaymentComponent} from './frend-upgrade/verify-payment.component';



const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [NonMemberGuard]},
  { path: 'login', component: LoginComponent, canActivate: [DiscourseSSOGuard, NonMemberGuard]},
  { path: 'doc', component: DocComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [NonMemberGuard]},
  { path: 'password-reset', component: PasswordResetComponent, canActivate: [NonMemberGuard]},
  { path: 'support', component: SupportComponent},
  { path: 'join-completion', component: JoinCompletionComponent, canActivate: [AuthGuard]},
  { path: 'join-upload-photo', component: JoinUploadPhotoComponent, canActivate: [AuthGuard]},
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard]},
  { path: 'view-profile/:id', component: ViewProfileComponent, canActivate: [AuthGuard]},
  { path: 'update-profile', component: UpdateProfileComponent, canActivate: [AuthGuard]},
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard]},
  { path: 'messages/:recipientUserId', component: ViewConversationComponent, canActivate: [AuthGuard, PaidGuard]},
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard]},
  { path: 'flirts', component: FlirtsComponent, canActivate: [AuthGuard]},
  { path: 'profile-views', component: ProfileViewsComponent, canActivate: [AuthGuard, PaidGuard]},
  { path: 'upgrade', component: UpgradeComponent, canActivate: [AuthGuard]},
  { path: 'verify-payment', component: VerifyPaymentComponent, canActivate: [AuthGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},

  { path: 'testchat', component: TestChatComponent, canActivate: [AuthGuard]},
  { path: 'frend-upgrade', component: FrendUpgradeComponent, canActivate: [AuthGuard]},
  { path: 'frend-verify-payment', component: FrendVerifyPaymentComponent, canActivate: [AuthGuard]},

];

const appRoutingProviders: any[] = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [appRoutingProviders],
  exports: [RouterModule]
})
export class AppRoutingModule { }
