import { Injectable } from '@angular/core';
import { NodeModel } from '../models/node.model';
import { select } from 'd3-selection';
import { drag } from 'd3-drag';

@Injectable()
export class DraggableService {
  public makeDraggable(element: Element, model: NodeModel) {
    const d3Element = select(element);

    let deltaX: number;
    let deltaY: number;

    const dragBehaviour = drag()
      .on('start', (event: DragEvent) => {
        deltaX = model.position().x - event.x;
        deltaY = model.position().y - event.y;
      })
      .on('drag', (event: DragEvent) => {
        model.position.set({ x: event.x + deltaX, y: event.y + deltaY });
      });

    d3Element.call(dragBehaviour);
  }

  public destroy(element: Element) {
    select(element).on('.drag', null);
  }
}
