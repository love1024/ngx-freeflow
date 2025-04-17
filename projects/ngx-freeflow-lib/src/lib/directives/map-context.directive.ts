import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { select } from 'd3-selection';
import { D3ZoomEvent, zoom, ZoomBehavior, zoomIdentity } from 'd3-zoom';
import { RootSvgReferenceDirective } from './reference.directive';
import { ViewportService } from '../core/services/viewport.service';
import { isDefined } from '../core/utils/is-defined';

type ZoomEvent = D3ZoomEvent<SVGSVGElement, unknown>;

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: 'g[mapContext]', providers: [ViewportService] })
export class MapContextDirective implements OnInit {
  public minZoom = input.required<number>();
  public maxZoom = input.required<number>();

  protected rootSvg = inject(RootSvgReferenceDirective).element;
  protected host = inject<ElementRef<SVGGElement>>(ElementRef).nativeElement;
  protected viewportService = inject(ViewportService);

  private rootSvgSelection = select(this.rootSvg);
  private zoomableSelection = select(this.host);

  // under the hood this effect triggers handleZoom, so error throws without this flag
  // TODO: hack with timer fixes wrong node scaling (handle positions not matched with content size)
  protected manualViewportChangeEffect = effect(() =>
    setTimeout(() => {
      const viewport = this.viewportService.writableViewport();
      const state = viewport.state;

      if (viewport.changeType === 'initial') {
        return;
      }

      // If only zoom provided
      if (isDefined(state.zoom) && !isDefined(state.x) && !isDefined(state.y)) {
        this.rootSvgSelection.call(this.zoomBehavior.scaleTo, state.zoom);

        return;
      }

      // If only pan provided
      if (isDefined(state.x) && isDefined(state.y) && !isDefined(state.zoom)) {
        this.rootSvgSelection.call(
          this.zoomBehavior.translateTo,
          state.x,
          state.y
        );

        return;
      }

      // If whole viewort state provided
      if (isDefined(state.x) && isDefined(state.y) && isDefined(state.zoom)) {
        this.rootSvgSelection.call(
          this.zoomBehavior.transform,
          zoomIdentity.translate(state.x, state.y).scale(state.zoom)
        );

        return;
      }
    })
  );

  protected zoomBehavior!: ZoomBehavior<SVGSVGElement, unknown>;

  ngOnInit() {
    const zoomBehaviour = zoom<SVGSVGElement, unknown>()
      .scaleExtent([this.minZoom(), this.maxZoom()])
      .on('zoom', evt => this.handleZoom(evt));

    this.rootSvgSelection.call(zoomBehaviour);
  }

  handleZoom({ transform }: ZoomEvent) {
    this.viewportService.readableViewport.set({
      zoom: transform.k,
      x: transform.x,
      y: transform.y,
    });

    this.zoomableSelection.attr('transform', transform.toString());
  }
}
