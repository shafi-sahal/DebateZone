import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({ selector: '[appAdaptHeight]' })
export class AdaptHeight implements AfterViewInit {
  private body: HTMLBodyElement = this.element.nativeElement;
  private matCard!: HTMLElement;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const matCard = document.getElementById('mat-card');
    if (matCard) { this.matCard = matCard; }
    const resizeObserver = new ResizeObserver(() => this.adjustScreenHeight(this.matCard.offsetHeight));
    resizeObserver.observe(this.matCard);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void { this.adjustScreenHeight(this.matCard.offsetHeight); }

  private adjustScreenHeight(matCardHeight: number): void {
    if (matCardHeight >= window.innerHeight) {
      this.renderer.setStyle(this.body, 'height', matCardHeight + 100 + 'px');
    } else {
      this.renderer.setStyle(this.body, 'height', window.innerHeight + 'px');
    }
  }
}
