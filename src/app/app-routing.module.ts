import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingComponent} from "./landing/landing.component";

const routes: Routes = [
  { path: '', component: LandingComponent},
];

const appRoutingProviders: any[] = [];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  providers: [appRoutingProviders],
  exports: [RouterModule]
})
export class AppRoutingModule { }
