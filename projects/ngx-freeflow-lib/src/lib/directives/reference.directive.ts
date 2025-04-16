import { Directive, ElementRef, inject } from '@angular/core';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: 'svg[rootSvgRef]' })
export class RootSvgReferenceDirective {
  public readonly element =
    inject<ElementRef<SVGSVGElement>>(ElementRef).nativeElement;
}
