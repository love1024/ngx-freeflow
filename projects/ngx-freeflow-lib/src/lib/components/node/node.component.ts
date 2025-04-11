import {
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NodeModel } from '../../core/models/node.model';
import { DraggableService } from '../../core/services/draggable.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'g[node]',
  imports: [NgTemplateOutlet],
  templateUrl: './node.component.html',
})
export class NodeComponent implements OnInit, OnDestroy {
  nodeModel = input.required<NodeModel>();
  nodeTemplate = input.required<TemplateRef<unknown>>();

  private draggableService = inject(DraggableService);
  private hostRef = inject<ElementRef<SVGElement>>(ElementRef);

  ngOnInit() {
    this.draggableService.makeDraggable(
      this.hostRef.nativeElement,
      this.nodeModel()
    );
  }

  ngOnDestroy() {
    this.draggableService.destroy(this.hostRef.nativeElement);
  }
}
