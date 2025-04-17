import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  TemplateRef,
} from '@angular/core';
import { EdgeModel } from '../../core/models/edge.model';
import { hashCode } from '../../core/utils/hash';
import { EdgeLabelComponent } from '../edge-label/edge-label.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'g[edge]',
  imports: [EdgeLabelComponent],
  templateUrl: './edge.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdgeComponent {
  model = input.required<EdgeModel>();

  edgeTemplate = input<TemplateRef<unknown>>();
  edgeLabelHtmlTemplate = input<TemplateRef<unknown>>();

  markerStartUrl = computed(() => {
    const marker = this.model().edge.markers?.start;

    return marker ? `url(#${hashCode(JSON.stringify(marker))})` : '';
  });

  markerEndUrl = computed(() => {
    const marker = this.model().edge.markers?.end;

    return marker ? `url(#${hashCode(JSON.stringify(marker))})` : '';
  });

  getContext() {
    return {
      $implicit: {
        edge: this.model().edge,
        path: computed(() => this.model().path),
      },
    };
  }
}
