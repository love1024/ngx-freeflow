import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  computed,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { EdgeLabelModel } from '../../core/models/edge-label.model';
import { EdgeModel } from '../../core/models/edge.model';
import { Point } from '../../core/interfaces/point.interface';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'g[edgeLabel]',
  imports: [NgTemplateOutlet],
  templateUrl: './edge-label.component.html',
  styles: [
    `
      .edge-label-wrapper {
        width: max-content;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdgeLabelComponent implements AfterViewInit {
  model = input.required<EdgeLabelModel>();

  edgeModel = input.required<EdgeModel>();

  point = input<Point>();

  htmlTemplate = input<TemplateRef<unknown>>();

  edgeLabelWrapperRef =
    viewChild<ElementRef<HTMLDivElement>>('edgeLabelWrapper');

  /**
   * Centered point of label
   *
   * TODO: maybe put it into EdgeLabelModel
   */
  protected edgeLabelPoint = computed(() => {
    const point = this.pointSignal();

    const { width, height } = this.model().size();

    return {
      x: point.x - width / 2,
      y: point.y - height / 2,
    };
  });

  private pointSignal = signal({ x: 0, y: 0 });

  public ngAfterViewInit(): void {
    queueMicrotask(() => {
      const edgeLabelRef = this.edgeLabelWrapperRef();
      if (!edgeLabelRef) {
        return;
      }
      const width = edgeLabelRef.nativeElement.clientWidth;
      const height = edgeLabelRef.nativeElement.clientHeight;

      this.model().size.set({ width, height });
    });
  }

  protected getLabelContext() {
    return {
      $implicit: {
        edge: this.edgeModel().edge,
        label: this.model().edgeLabel,
      },
    };
  }

  constructor() {
    effect(() => {
      const point = this.point();
      if (point) {
        this.pointSignal.set(point);
      }
    });
  }
}
