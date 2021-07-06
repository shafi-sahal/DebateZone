import { AfterViewInit, Directive, HostListener} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { screenSizes } from '../../assets/screen-sizes';

@Directive({ selector: '[appAdaptSideNavToDevice]' })
export class SideNavRenderer implements AfterViewInit {
  private previousWindowWidth = 0;

  constructor (private sidenav: MatSidenav) {}

  ngAfterViewInit(): void {
    this.adaptSideNavToDevice();
  }

  @HostListener('window:resize', ['$event'])
  private adaptSideNavToDevice(): void {
    const windowWidth = window.innerWidth;
    const buttonMenu = document.getElementById('button-menu');
    if (windowWidth < screenSizes.desktopWidth) {
      this.sidenav.mode = 'over';
      if (this.previousWindowWidth >= screenSizes.desktopWidth) { this.sidenav.close(); }
      buttonMenu?.removeAttribute('hidden');
    } else {
      this.sidenav.mode = 'side';
      this.sidenav.open();
      buttonMenu?.setAttribute('hidden', 'true');
    }
    this.previousWindowWidth = windowWidth;
  }
}
