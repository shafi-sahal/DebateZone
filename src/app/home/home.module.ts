import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AngularMaterialModule } from '../angular-material.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavAdapter } from './sidenav-adapter.directive';
import { NavElementsComponent } from './nav-elements/nav-elements.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { NavService } from './nav.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    HomeComponent,
    SidenavAdapter,
    NavElementsComponent,
    BottomNavComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AngularMaterialModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [NavService]
})
export class HomeModule { }
