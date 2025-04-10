import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  contentChild,
  inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { Node } from '../../core/interfaces/node.interface';
import { DraggableContextDirective } from '../../directives/draggable-context.directive';
import { NodeComponent } from '../node/node.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ff-flow',
  imports: [DraggableContextDirective, NodeComponent],
  templateUrl: './flow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowComponent {
  view = input<[number, number] | 'auto'>([400, 400]);
  nodes = input<Node[]>([]);
  background = input<string>('#ffffff');

  draggableContext = viewChild(DraggableContextDirective);
  private _nodeTemplate = contentChild<TemplateRef<unknown>>('nodeTemplate');

  get nodeTemplate() {
    const template = this._nodeTemplate();
    if (!template) {
      throw new Error('nodeTemplate is required but was not provided');
    }
    return template;
  }

  get flowWidth() {
    return this.view() === 'auto' ? '100%' : this.view()[0];
  }

  get flowHeight() {
    return this.view() === 'auto' ? '100%' : this.view()[1];
  }

  cd = inject(ChangeDetectorRef);
}
