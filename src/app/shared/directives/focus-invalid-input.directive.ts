import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[appFocusInvalidInput]' })
export class FocusInvalidInputDirective {
  constructor(private element: ElementRef) {}

  @HostListener('submit')
  onSubmit(): void {
    const invalidControl: HTMLInputElement = this.element.nativeElement.querySelector('input.ng-invalid');
    if (invalidControl) { invalidControl.focus(); }
  }
}
