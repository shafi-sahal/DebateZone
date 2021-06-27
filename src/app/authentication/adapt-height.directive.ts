import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[appAdaptHeight]' })
export class AdaptHeight implements AfterViewInit {
  private body: HTMLBodyElement = this.element.nativeElement;
  constructor(private element: ElementRef) {}

  ngAfterViewInit(): void {
    const matCard = this.body.childNodes[0] as HTMLElement;
    const resizeObserver = new ResizeObserver(() => this.adjustScreenHeight(matCard.offsetHeight));
    resizeObserver.observe(matCard);
  }

  private adjustScreenHeight(matCardHeight: number): void {
    if (matCardHeight >= window.innerHeight) {
      this.body.style.height = matCardHeight + 100 + 'px';
    } else {
      this.body.style.height = window.innerHeight + 'px';
    }
  }
}
