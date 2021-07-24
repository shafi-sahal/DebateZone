import { AfterViewInit, ContentChild, Directive, EventEmitter, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { DeviceTypeChecker } from '../device-type-checker.service';

@Directive({ selector: '[appAdaptSidenavToDevice]' })
export class SidenavAdapter implements AfterViewInit {
  @ContentChild('sidenav') sidenav!: MatSidenav;
  private previousIsMobile = true;
  private subscriptions = new Subscription();

  constructor(private deviceTypeChecker: DeviceTypeChecker) {}

  ngAfterViewInit(): void {
    this.subscriptions.add(this.deviceTypeChecker.isMobile.subscribe(isMobile => this.adaptSidenavToedvice(isMobile)));
  }

  private adaptSidenavToedvice(isMobile: boolean): void {
    if (isMobile) {
      this.sidenav.mode = 'over';
      if (!this.previousIsMobile) this.sidenav.close();
    } else {
      this.sidenav.mode = 'side';
      this.sidenav.open();
    }

    this.previousIsMobile = isMobile;
  }
}
