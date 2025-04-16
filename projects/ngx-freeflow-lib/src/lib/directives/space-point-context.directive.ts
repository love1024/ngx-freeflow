import { computed, Directive, ElementRef, inject, Signal } from '@angular/core';
import { Point } from '../core/interfaces/point.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map } from 'rxjs';
import { RootSvgReferenceDirective } from './reference.directive';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: 'g[spacePointContext]' })
export class NameDirective {
  public svgCurrentSpacePoint: Signal<Point> = computed(() => {
    const movement = this.mouseMovement();

    const point = this.rootSvg.createSVGPoint();
    point.x = movement.x;
    point.y = movement.y;

    return point.matrixTransform(this.host.getScreenCTM()?.inverse());
  });

  private rootSvg = inject(RootSvgReferenceDirective).element;
  private host = inject<ElementRef<SVGGElement>>(ElementRef).nativeElement;

  private mouseMovement = toSignal(
    fromEvent<MouseEvent>(this.rootSvg, 'mousemove').pipe(
      map(event => ({ x: event.clientX, y: event.clientY }))
    ),
    { initialValue: { x: 0, y: 0 } }
  );
}
