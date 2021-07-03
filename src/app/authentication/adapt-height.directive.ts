import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[appAdaptHeight]' })
export class AdaptHeight implements AfterViewInit {
  private body: HTMLBodyElement = this.element.nativeElement;
  private matCard!: HTMLElement;

  constructor(private element: ElementRef) {}

  ngAfterViewInit(): void {
    this.matCard = this.body.childNodes[0] as HTMLElement;
    const resizeObserver = new ResizeObserver(() => this.adjustScreenHeight(this.matCard.offsetHeight));
    resizeObserver.observe(this.matCard);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void { this.adjustScreenHeight(this.matCard.offsetHeight); }

  private adjustScreenHeight(matCardHeight: number): void {
    if (matCardHeight >= window.innerHeight) {
      this.body.style.height = matCardHeight + 100 + 'px';
    } else {
      this.body.style.height = window.innerHeight + 'px';
    }
  }
}
