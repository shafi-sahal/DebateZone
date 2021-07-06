import { AfterViewInit, Directive, HostListener} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Directive({ selector: '[appAdaptSideNavToDevice]' })
export class SideNavRenderer implements AfterViewInit {
  constructor (private sidenav: MatSidenav) {}

  ngAfterViewInit(): void {
    this.adaptSideNavToDevice();
  }

  @HostListener('window:resize', ['$event'])
  private onResize(): void { this.adaptSideNavToDevice(); }

  private adaptSideNavToDevice(): void {
    const buttonMenu = document.getElementById('button-menu');
    console.log(buttonMenu);
    if (window.innerWidth < 768) {
      this.sidenav.mode = 'over';
      buttonMenu?.removeAttribute('hidden');
    } else {
      this.sidenav.mode = 'side';
      this.sidenav.opened = true;
      buttonMenu?.setAttribute('hidden', 'true');
    }
  }
}
