import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';

@Directive({ selector: '[appApplyRenderer]' })
export class RendererDirective implements OnInit {
  private screenWidth = 0;

  constructor ( private matCard: ElementRef, private renderer: Renderer2 ) {}

  ngOnInit(): void { this.onResize(); }

  @HostListener('window:resize')
  onResize(): void {
    this.screenWidth = window.innerWidth;
    this.resizeMatCard();
  }

  private getnewMatcardWidthPercentage(): string {
    /*
      matCardConstant = default-screen-width * default-mat-card-width-percentage = 1366 * 45 = 58230
      default-screen-width = 1366px, width of my laptop screen
      default-mat-card-width-percentage is 45%
    */
    const matCardConstant = 58230;
    return matCardConstant / this.screenWidth + '%';
  }

  private resizeMatCard(): void {
    const smallestMobileLandScapeScreenWidth = 601;
    const matCardWidthPercentage = this.screenWidth < smallestMobileLandScapeScreenWidth
                                   ? '90%'
                                   : this.getnewMatcardWidthPercentage();
    this.renderer.setStyle(this.matCard.nativeElement, 'width', matCardWidthPercentage);
  }
}
