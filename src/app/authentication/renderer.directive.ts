import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';

@Directive({ selector: '[appApplyRenderer]' })
export class RendererDirective implements OnInit {
  constructor ( private matCard: ElementRef, private renderer: Renderer2 ) {}

  ngOnInit(): void { this.onResize(); }

  @HostListener('window:resize')
  onResize(): void {
    const screenWidth = window.innerWidth;
    const smallestMobileLandScapeScreenWidth = 601;
    const matCardWidth = screenWidth < smallestMobileLandScapeScreenWidth ? '90%' : '582px';
    this.renderer.setStyle(this.matCard.nativeElement, 'width', matCardWidth);
  }
}
