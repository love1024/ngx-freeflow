import { Directive, inject, TemplateRef } from '@angular/core';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: 'ng-template[edge]' })
export class EdgeTemplateDirective {
  public templateRef = inject(TemplateRef);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: 'ng-template[connection]' })
export class ConnectionTemplateDirective {
  public templateRef = inject(TemplateRef);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: 'ng-template[edgeLabelHtml]' })
export class EdgeLabelHtmlTemplateDirective {
  public templateRef = inject(TemplateRef);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: 'ng-template[nodeHtml]' })
export class NodeHtmlTemplateDirective {
  public templateRef = inject(TemplateRef);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: 'ng-template[handle]' })
export class HandleTemplateDirective {
  public templateRef = inject(TemplateRef);
}
