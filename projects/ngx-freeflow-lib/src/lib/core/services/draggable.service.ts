import { Injectable } from '@angular/core';
import { NodeModel } from '../models/node.model';
import { select } from 'd3-selection';
import { drag } from 'd3-drag';
import { round } from '../utils/round';

@Injectable()
export class DraggableService {
  public toggleDraggable(element: Element, model: NodeModel) {
    const d3Element = select(element);

    const behavior = model.draggable
      ? this.getDragBehavior(model)
      : this.getIgnoreDragBehavior();

    d3Element.call(behavior);
  }

  public destroy(element: Element) {
    select(element).on('.drag', null);
  }

  private getDragBehavior(model: NodeModel) {
    let deltaX: number;
    let deltaY: number;

    return drag()
      .on('start', (event: DragEvent) => {
        deltaX = model.point().x - event.x;
        deltaY = model.point().y - event.y;
      })
      .on('drag', (event: DragEvent) => {
        model.point.set({
          x: round(event.x + deltaX),
          y: round(event.y + deltaY),
        });
      });
  }

  /**
   * Specify ignoring drag behavior. It's responsible for not moving the map when user tries to drag node
   * with disabled drag behavior
   */
  private getIgnoreDragBehavior() {
    return drag().on('drag', (event: DragEvent) => {
      (event as Event).stopPropagation();
    });
  }
}
