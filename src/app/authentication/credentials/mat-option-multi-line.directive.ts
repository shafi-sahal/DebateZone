import { AfterViewInit, Directive, ElementRef, OnInit } from '@angular/core';

@Directive({ selector: '[appMultiLine]' })
export class MatOptionMultiLineDirective implements AfterViewInit {
  constructor(private matOption: ElementRef) {}

  ngAfterViewInit(): void {
    const matOptionText: HTMLSpanElement = this.matOption.nativeElement.childNodes[1];
    matOptionText.style.cssText = 'line-height: initial; white-space: normal;';

    /*
      The country 'Saint Vincent and the Grenadines' and it's country code are taking much width in the mat-options causing to
      have dialCode written in multiple lines on small screen mobiles like Galaxy S5 and smaller.

      The cause of this problem is that even though multiline is enabled in mat-option, the paragraph element is taking the
      full width available for it in the flex.

      This problem only occurs for the aforementioned country because of its longer dial code
      So, reducing the width of the paragraph in which the specified country contains solves the problem
      60px is the width for 6 characters, which is the length of the dial code of the specified country(+1 784)
    */
    const countryContainer = matOptionText.childNodes[0];
    const countryParagraph = countryContainer.childNodes[0] as HTMLParagraphElement;
    const countryName = countryParagraph.innerText;

    if(countryName === 'Saint Vincent and the Grenadines') {
      countryParagraph.style['width'] = 'calc(100% - 60px)';
    }
  }
}
