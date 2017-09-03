import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingComponent} from "./landing/landing.component";
import {JoinCompletionComponent} from "./join-completion/join-completion.component";
import {JoinUploadPhotoComponent} from "./join-upload-photo/join-upload-photo.component";
import {SearchComponent} from "./search/search.component";
import {LoginComponent} from "./login/login.component";
import {ViewProfileComponent} from "./view-profile/view-profile.component";
import {UpdateProfileComponent} from "./update-profile/update-profile.component";
import {MessagesComponent} from "./messages/messages.component";
import {ViewConversationComponent} from "./messages/view-conversation.component";
import {FavoritesComponent} from "./favorites/favorites.component";
import {FlirtsComponent} from "./flirts/flirts.component";
import {ProfileViewsComponent} from "./profile-views/profile-views.component";


import {AuthGuard} from "./guards/auth.guard";


const routes: Routes = [
  { path: '', component: LandingComponent},
  { path: 'login', component: LoginComponent},
  { path: 'join-completion', component: JoinCompletionComponent, canActivate: [AuthGuard]},
  { path: 'join-upload-photo', component: JoinUploadPhotoComponent, canActivate: [AuthGuard]},
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard]},
  { path: 'view-profile/:id', component: ViewProfileComponent, canActivate: [AuthGuard]},
  { path: 'update-profile', component: UpdateProfileComponent, canActivate: [AuthGuard]},
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard]},
  { path: 'messages/:recipientUserId', component: ViewConversationComponent, canActivate: [AuthGuard]},
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard]},
  { path: 'flirts', component: FlirtsComponent, canActivate: [AuthGuard]},
  { path: 'profile-views', component: ProfileViewsComponent, canActivate: [AuthGuard]},
];

const appRoutingProviders: any[] = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [appRoutingProviders],
  exports: [RouterModule]
})
export class AppRoutingModule { }
