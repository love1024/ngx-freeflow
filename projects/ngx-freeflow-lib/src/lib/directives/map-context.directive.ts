import {
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  OnInit,
  runInInjectionContext,
} from '@angular/core';
import { ZoomService } from '../core/services/zoom.service';
import { select } from 'd3-selection';
import { D3ZoomEvent, zoom, ZoomBehavior } from 'd3-zoom';

type ZoomEvent = D3ZoomEvent<SVGSVGElement, unknown>;

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: 'g[mapContext]' })
export class MapContextDirective implements OnInit {
  public minZoom = input.required<number>();
  public maxZoom = input.required<number>();

  private get zoomableElement() {
    return this.hostRef.nativeElement;
  }

  private get rootSvgElement() {
    return this.zoomableElement.parentElement as Element as SVGSVGElement;
  }

  private hostRef = inject<ElementRef<SVGElement>>(ElementRef);
  private zoomService = inject(ZoomService);
  private injector = inject(Injector);

  private rootSvgSelection = select(this.rootSvgElement);
  private zoomableSelection = select(this.zoomableElement);

  ngOnInit() {
    const zoomBehaviour = zoom<SVGSVGElement, unknown>()
      .scaleExtent([this.minZoom(), this.maxZoom()])
      .on('zoom', evt => this.handleZoom(evt));

    this.rootSvgSelection.call(zoomBehaviour);

    runInInjectionContext(this.injector, () => {
      this.manualZoomChangeEffect(zoomBehaviour);
      this.manualPanChangeEffect(zoomBehaviour);
    });
  }

  handleZoom({ transform }: ZoomEvent) {
    this.zoomService.zoomPan.set({
      zoom: transform.k,
      x: transform.x,
      y: transform.y,
    });

    this.zoomableSelection.attr('transform', transform.toString());
  }

  private manualZoomChangeEffect(
    behavior: ZoomBehavior<SVGSVGElement, unknown>
  ) {
    effect(() => {
      this.rootSvgSelection.call(behavior.scaleTo, this.zoomService.zoom());
    });
  }

  private manualPanChangeEffect(
    behavior: ZoomBehavior<SVGSVGElement, unknown>
  ) {
    effect(() => {
      this.rootSvgSelection.call(
        behavior.translateTo,
        this.zoomService.pan().x,
        this.zoomService.pan().y
      );
    });
  }
}
