import { Injectable } from '@angular/core';
import { BlockComponent } from '../../components/block/block.component';

@Injectable({ providedIn: 'root' })
export class TreeManagerService {
  private entries = new Map<Element, BlockComponent>();

  register(svgElement: Element, component: BlockComponent) {
    this.entries.set(svgElement, component);
  }

  get(svgElement: Element) {
    return this.entries.get(svgElement);
  }

  has(svgElement: Element | null): svgElement is Element {
    if (svgElement) {
      return this.entries.has(svgElement);
    }

    return false;
  }
}
