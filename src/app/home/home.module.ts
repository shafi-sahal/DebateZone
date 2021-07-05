import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AngularMaterialModule } from '../angular-material.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MenuMobileComponent } from './menu/menu-mobile/menu-mobile.component';

@NgModule({
  declarations: [
    HomeComponent,
    MenuMobileComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AngularMaterialModule,
    MatSidenavModule
  ]
})
export class HomeModule { }
