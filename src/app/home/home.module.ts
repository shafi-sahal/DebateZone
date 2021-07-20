import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AngularMaterialModule } from '../angular-material.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavAdapter } from './sidenav-adapter.directive';
import { NavElementsComponent } from './nav-elements/nav-elements.component';

@NgModule({
  declarations: [
    HomeComponent,
    SidenavAdapter,
    NavElementsComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AngularMaterialModule,
    MatSidenavModule,
    AngularMaterialModule
  ]
})
export class HomeModule { }
