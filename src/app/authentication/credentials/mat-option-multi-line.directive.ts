import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({ selector: '[appMultiLine]' })
export class MatOptionMultiLineDirective implements OnInit {
  constructor(private matOption: ElementRef) {}

  ngOnInit(): void {
    this.matOption.nativeElement.childNodes[1].style.cssText = 'line-height: initial; white-space: normal';
  }
}
