import { Directive, ElementRef, inject } from '@angular/core';
import { Node } from '../core/interfaces/node.interface';
import { Point } from '../core/interfaces/point.interface';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'svg[draggableContext]',
  host: {
    '(mousemove)': 'onDrag($event)',
    '(mouseup)': 'onDragEnd()',
  },
})
export class DraggableContextDirective {
  hostRef = inject<ElementRef<SVGSVGElement>>(ElementRef);

  private draggingNode: Node | null = null;
  private draggingNodeOffset: Point = { x: 0, y: 0 };

  public onDragStart(node: Node, event: Event) {
    this.draggingNode = node;

    this.draggingNodeOffset = this.getMousePosition(event as MouseEvent);
    this.draggingNodeOffset.x -= node.position.x;
    this.draggingNodeOffset.y -= node.position.y;
    console.log(this.draggingNodeOffset);
  }

  public onDrag(event: DragEvent) {
    if (this.draggingNode) {
      event.preventDefault();
      const position = this.getMousePosition(event as MouseEvent);
      console.log(position);

      this.draggingNode.position = {
        x: position.x - this.draggingNodeOffset.x,
        y: position.y - this.draggingNodeOffset.y,
      };
    }
  }

  public onDragEnd() {
    this.draggingNode = null;
    this.draggingNodeOffset = { x: 0, y: 0 };
  }

  private getMousePosition(event: MouseEvent): Point {
    const CTM = this.hostRef.nativeElement.getScreenCTM();

    return {
      x: (event.clientX - CTM!.e) / CTM!.a,
      y: (event.clientY - CTM!.f) / CTM!.d,
    };
  }
}
