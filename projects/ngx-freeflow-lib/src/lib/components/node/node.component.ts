import { Component, input, TemplateRef } from '@angular/core';
import { Node } from '../../core/interfaces/node.interface';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'g[node]',
  imports: [NgTemplateOutlet],
  templateUrl: './node.component.html',
})
export class NodeComponent {
  node = input.required<Node>();
  nodeTemplate = input.required<TemplateRef<unknown>>();
}
