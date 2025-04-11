import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { Node } from '../../core/interfaces/node.interface';
import { NodeComponent } from '../node/node.component';
import { MapContextDirective } from '../../directives/map-context.directive';
import { NodeModel } from '../../core/models/node.model';
import { ZoomService } from '../../core/services/zoom.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { DraggableService } from '../../core/services/draggable.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ff-flow',
  imports: [MapContextDirective, NodeComponent],
  templateUrl: './flow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ZoomService, DraggableService],
})
export class FlowComponent {
  protected zoomService = inject(ZoomService);

  view = input<[number, number] | 'auto'>([400, 400]);
  nodes = input<NodeModel[], Node[]>([], {
    transform: nodes => nodes.map(node => new NodeModel(node)),
  });
  minZoom = input(0.5);
  maxZoom = input(3);
  zoom = input<number>();

  public readonly zoomPanSignal = this.zoomService.zoomPan;
  public readonly zoomPan$ = toObservable(this.zoomService.zoomPan);

  background = input<string>('#ffffff');
  mapContext = viewChild(MapContextDirective);

  private _nodeTemplate = contentChild<TemplateRef<unknown>>('nodeTemplate');

  constructor() {
    effect(() => {
      const zoom = this.zoom();
      if (zoom) {
        this.zoomTo(zoom);
      }
    });
  }

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

  public zoomTo(value: number) {
    this.zoomService.zoom.set(value);
  }

  public panTo(value: { x: number; y: number }) {
    this.zoomService.pan.set(value);
  }
}
