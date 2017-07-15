import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingComponent} from "./landing/landing.component";
import {JoinCompletionComponent} from "./join-completion/join-completion.component";

const routes: Routes = [
  { path: '', component: LandingComponent},
  { path: 'join-completion', component: JoinCompletionComponent},
];

const appRoutingProviders: any[] = [];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  providers: [appRoutingProviders],
  exports: [RouterModule]
})
export class AppRoutingModule { }
