import { AfterViewInit, ContentChild, Directive, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { screenSizes } from '../../assets/screen-sizes';
import { WindowRef } from '../window-ref.service';

@Directive({ selector: '[appAdaptSidenavToDevice]' })
export class SidenavAdapter implements AfterViewInit {
  @Output() isMobile = new EventEmitter<boolean>();
  @ContentChild('sidenav') sidenav!: MatSidenav;
  private previousIsMobile = true;

  constructor(private renderer: Renderer2, private windowRef: WindowRef) {}

  ngAfterViewInit(): void {
    this.adaptSidenavToedvice();
  }

  @HostListener('window:resize', ['$event'])
  private adaptSidenavToedvice(): void {
    const isMobile = this.windowRef.nativeWindow.innerWidth < screenSizes.desktopWidth;
    this.isMobile.emit(isMobile);
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
