import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AngularMaterialModule } from '../angular-material.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidenavAdapter } from './sidenav-adapter.directive';

@NgModule({
  declarations: [
    HomeComponent,
    SidenavAdapter
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AngularMaterialModule,
    MatSidenavModule
  ]
})
export class HomeModule { }
