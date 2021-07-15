import { AfterViewInit, ContentChild, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { screenSizes } from '../../assets/screen-sizes';

@Directive({ selector: '[appAdaptSidenavToDevice]' })
export class SidenavAdapter implements AfterViewInit {
  @ContentChild('sidenav') sidenav!: MatSidenav;
  @ContentChild('buttonMenu', { read: ElementRef }) buttonMenu!: ElementRef;
  private previousIsMobile = true;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.adaptSidenavToedvice();
  }

  @HostListener('window:resize', ['$event'])
  private adaptSidenavToedvice(): void {
    const isMobile = window.innerWidth < screenSizes.desktopWidth;

    if (isMobile) {
      this.sidenav.mode = 'over';
      if (!this.previousIsMobile) this.sidenav.close();
      this.renderer.removeAttribute(this.buttonMenu.nativeElement, 'hidden');
    } else {
      this.sidenav.mode = 'side';
      this.sidenav.open();
      this.renderer.setAttribute(this.buttonMenu.nativeElement, 'hidden', 'true');
    }

    this.previousIsMobile = isMobile;
  }
}
