import { computed, signal } from '@angular/core';
import { Node } from '../interfaces/node.interface';
import { FlowModel } from './flow.model';
import { isDefined } from '../utils/is-defined';
import { toObservable } from '@angular/core/rxjs-interop';

export class NodeModel<T = unknown> {
  public point = signal({ x: 0, y: 0 });

  public points$ = toObservable(this.point);

  public size = signal({ width: 0, height: 0 });

  public draggable = true;

  public pointTransform = computed(
    () => `translate(${this.point().x}, ${this.point().y})`
  );

  public sourcePosition = computed(
    () => this.flow?.handlePositions()?.source ?? 'left'
  );
  public targetPosition = computed(
    () => this.flow?.handlePositions()?.target ?? 'right'
  );

  public sourceHandleSize = signal({ width: 0, height: 0 });
  public targetHandleSize = signal({ width: 0, height: 0 });

  public sourceOffset = computed(() => {
    const { width, height } = this.size();

    switch (this.sourcePosition()) {
      case 'left':
        return { x: 0, y: height / 2 };
      case 'right':
        return { x: width, y: height / 2 };
      case 'top':
        return { x: width / 2, y: 0 };
      case 'bottom':
        return { x: width / 2, y: height };
    }
    return { x: 0, y: 0 };
  });

  public targetOffset = computed(() => {
    const { width, height } = this.size();

    switch (this.targetPosition()) {
      case 'left':
        return { x: 0, y: height / 2 };
      case 'right':
        return { x: width, y: height / 2 };
      case 'top':
        return { x: width / 2, y: 0 };
      case 'bottom':
        return { x: width / 2, y: height };
    }
    return { x: 0, y: 0 };
  });

  public sourceHandleOffset = computed(() => {
    switch (this.sourcePosition()) {
      case 'left':
        return { x: -(this.sourceHandleSize().width / 2), y: 0 };
      case 'right':
        return { x: this.sourceHandleSize().width / 2, y: 0 };
      case 'top':
        return { x: 0, y: -(this.sourceHandleSize().height / 2) };
      case 'bottom':
        return { x: 0, y: this.sourceHandleSize().height / 2 };
    }
    return { x: 0, y: 0 };
  });

  public targetHandleOffset = computed(() => {
    switch (this.targetPosition()) {
      case 'left':
        return { x: -(this.targetHandleSize().width / 2), y: 0 };
      case 'right':
        return { x: this.targetHandleSize().width / 2, y: 0 };
      case 'top':
        return { x: 0, y: -(this.targetHandleSize().height / 2) };
      case 'bottom':
        return { x: 0, y: this.targetHandleSize().height / 2 };
    }
    return { x: 0, y: 0 };
  });

  public sourcePointAbsolute = computed(() => {
    return {
      x: this.point().x + this.sourceOffset().x + this.sourceHandleOffset().x,
      y: this.point().y + this.sourceOffset().y + this.sourceHandleOffset().y,
    };
  });

  public targetPointAbsolute = computed(() => {
    return {
      x: this.point().x + this.targetOffset().x + this.targetHandleOffset().x,
      y: this.point().y + this.targetOffset().y + this.targetHandleOffset().y,
    };
  });

  public sourceOffsetAligned = computed(() => {
    return {
      x: this.sourceOffset().x - this.sourceHandleSize().width / 2,
      y: this.sourceOffset().y - this.sourceHandleSize().height / 2,
    };
  });

  public targetOffsetAligned = computed(() => {
    return {
      x: this.targetOffset().x - this.targetHandleSize().width / 2,
      y: this.targetOffset().y - this.targetHandleSize().height / 2,
    };
  });

  public readonly magnetRadius = 20;
  private flow?: FlowModel;
  constructor(public node: Node<T>) {
    this.point.set(node.point);

    if (isDefined(node.draggable)) {
      this.draggable = node.draggable;
    }
  }

  public setFlow(flow: FlowModel) {
    this.flow = flow;
  }
}
