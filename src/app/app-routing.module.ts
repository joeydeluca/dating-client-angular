import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingComponent} from "./landing/landing.component";
import {JoinCompletionComponent} from "./join-completion/join-completion.component";
import {JoinUploadPhotoComponent} from "./join-upload-photo/join-upload-photo.component";
import {SearchComponent} from "./search/search.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./guards/auth.guard";


const routes: Routes = [
  { path: '', component: LandingComponent},
  { path: 'login', component: LoginComponent},
  { path: 'join-completion', component: JoinCompletionComponent, canActivate: [AuthGuard]},
  { path: 'join-upload-photo', component: JoinUploadPhotoComponent, canActivate: [AuthGuard]},
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard]},
];

const appRoutingProviders: any[] = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [appRoutingProviders],
  exports: [RouterModule]
})
export class AppRoutingModule { }
