import { AfterViewInit, Directive, HostListener} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Directive({ selector: '[appAdaptSideNavToDevice]' })
export class SideNavRenderer implements AfterViewInit {
  constructor (private sidenav: MatSidenav) {}

  ngAfterViewInit(): void {
    this.adaptSideNavToDevice();
  }

  @HostListener('window:resize', ['$event'])
  private adaptSideNavToDevice(): void {
    const buttonMenu = document.getElementById('button-menu');
    if (window.innerWidth < 768) {
      this.sidenav.mode = 'over';
      this.sidenav.close();
      buttonMenu?.removeAttribute('hidden');
    } else {
      this.sidenav.mode = 'side';
      this.sidenav.open();
      buttonMenu?.setAttribute('hidden', 'true');
    }
  }
}
