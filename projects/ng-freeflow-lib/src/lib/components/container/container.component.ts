import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ContainerStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { DocViewComponent } from '../doc-view/doc-view.component';
import { ContainerViewModel } from '../../core/models/container-view.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { provideComponent } from '../../core/utils/provide-component';
import { BlockEvent } from '../../core/models/block-view.model';
import { FilterService } from '../../core/services/filter.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg[ff-container]',
  imports: [],
  templateUrl: './container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.width]': 'model().width',
    '[attr.height]': 'model().height',
    '[attr.x]': 'model().x',
    '[attr.y]': 'model().y',
    '(mouseover)': 'onMouseOver()',
    '(mouseout)': 'onMouseOut()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '[style.filter]': 'shadowUrl()',
  },
  providers: [provideComponent(ContainerComponent)],
  styles: [
    `
      :host {
        overflow: visible;
      }
      :host:focus {
        outline: none;
      }
    `,
  ],
})
export class ContainerComponent
  extends DocViewComponent<ContainerViewModel>
  implements OnInit, OnDestroy
{
  styleSheet = input.required<ContainerStyleSheet>();

  protected shadowUrl = computed(() => {
    const filter = this.model().filter();
    if (filter) {
      const shadowId = this.filterService.getShadowId(filter);
      return `url(#${shadowId()})`;
    }

    return null;
  });

  private filterService = inject(FilterService);
  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    super();

    if (!this.parent) {
      throw new Error('block must not be used outside of doc root');
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.subscribeToViewUpdates();

    this.registerShadows();
  }

  ngOnDestroy(): void {
    this.model().destroy();
  }

  protected onMouseOver() {
    this.model().triggerBlockEvent(BlockEvent.hoverIn);
  }

  protected onMouseOut() {
    this.model().triggerBlockEvent(BlockEvent.hoverOut);
  }

  protected onFocus() {
    this.model().triggerBlockEvent(BlockEvent.focusIn);
  }

  protected onBlur() {
    this.model().triggerBlockEvent(BlockEvent.focusOut);
  }

  protected modelFactory(): ContainerViewModel {
    return new ContainerViewModel(this, this.styleSheet());
  }

  private subscribeToViewUpdates(): void {
    this.model()
      .viewUpdate.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cd.markForCheck();
      });
  }

  private registerShadows() {
    const shadows = [
      this.styleSheet().boxShadow,
      this.styleSheet().onHover?.boxShadow,
      this.styleSheet().onFocus?.boxShadow,
    ];

    for (const shadow of shadows) {
      if (shadow) {
        this.filterService.addShadow(shadow);
      }
    }
  }
}
