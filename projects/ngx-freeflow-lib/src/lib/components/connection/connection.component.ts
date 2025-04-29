import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  TemplateRef,
} from '@angular/core';
import { ConnectionModel } from '../../core/models/connection.model';
import { FlowStatusService } from '../../core/services/flow-status.service';
import { SpacePointContextDirective } from '../../directives/space-point-context.directive';
import { straightPath } from '../../core/math/edge-path/straight-path';
import { bezierPath } from '../../core/math/edge-path/bezier-path';
import { hashCode } from '../../core/utils/hash';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'g[connection]',
  imports: [NgTemplateOutlet],
  template: `
    @let templateRef = template();
    @if (model().type === 'default' && path()) {
      <svg:path
        [attr.d]="path()"
        [attr.marker-end]="markerUrl()"
        [attr.stroke]="defaultColor"
        fill="none" />
    } @else if (model().type === 'template' && templateRef) {
      <ng-container *ngTemplateOutlet="templateRef; context: getContext()" />
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class ConnectionComponent {
  model = input.required<ConnectionModel>();
  template = input<TemplateRef<unknown>>();

  path = computed(() => {
    const status = this.flowStatusService.status();

    if (status.state === 'connection-start') {
      const sourceNode = status.payload.sourceNode;
      const sourcePoint = sourceNode.sourcePointAbsolute();
      const targetPoint = this.spacePointContext.svgCurrentSpacePoint();

      switch (this.model().curve) {
        case 'straight':
          return straightPath(sourcePoint, targetPoint).path;
        case 'bezier':
          return bezierPath(
            sourcePoint,
            targetPoint,
            sourceNode.sourcePosition(),
            sourceNode.targetPosition()
          ).path;
      }
    }

    if (status.state === 'connection-validation') {
      const sourcePoint = status.payload.sourceNode.sourcePointAbsolute();
      // ignore magnet if validation failed
      const targetPoint = status.payload.valid
        ? status.payload.targetNode.targetPointAbsolute()
        : this.spacePointContext.svgCurrentSpacePoint();

      switch (this.model().curve) {
        case 'straight':
          return straightPath(sourcePoint, targetPoint).path;
        case 'bezier':
          return bezierPath(
            sourcePoint,
            targetPoint,
            status.payload.sourceNode.sourcePosition(),
            status.payload.sourceNode.targetPosition()
          ).path;
      }
    }

    return null;
  });

  protected markerUrl = computed(() => {
    const marker = this.model().connection.marker;

    if (marker) {
      return `url(#${hashCode(JSON.stringify(marker))})`;
    }

    return '';
  });

  protected getContext() {
    return {
      $implicit: {
        path: this.path,
        marker: this.markerUrl,
      },
    };
  }

  protected readonly defaultColor = 'rgb(177, 177, 183)';

  private flowStatusService = inject(FlowStatusService);
  private spacePointContext = inject(SpacePointContextDirective);
}
