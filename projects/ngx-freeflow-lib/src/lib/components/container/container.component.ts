import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { ContainerStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { DocViewComponent } from '../doc-view/doc-view.component';
import { ContainerViewModel } from '../../core/models/container-view.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { provideComponent } from '../../core/utils/provide-component';
import { BlockEvent } from '../../core/models/block-view.model';
import { FilterService } from '../../core/services/filter.service';
import { AnimationGroupComponent } from '../animation-group/animation-group.component';
import { uuid } from '../../core/utils/uuid';
import { AnimationComponent } from '../animation/animation.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg[ff-container]',
  imports: [AnimationGroupComponent],
  templateUrl: './container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.width]': 'model().width',
    '[attr.height]': 'model().height',
    '[attr.x]': 'model().x',
    '[attr.y]': 'model().y',
    '(mouseenter)': 'onMouseOver()',
    '(mouseleave)': 'onMouseOut()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
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
  implements OnInit, OnDestroy, AfterViewInit
{
  styleSheet = input.required<ContainerStyleSheet>();
  protected id = uuid();

  protected shadowUrl = computed(() => {
    const filter = this.model().filter();
    if (filter) {
      const shadowId = this.filterService.getShadowId(filter);
      return `url(#${shadowId()})`;
    }

    return null;
  });

  private animationComponent = viewChild<AnimationComponent>('animation');
  private hoverAnimationComponent =
    viewChild<AnimationComponent>('hoverAnimation');
  private focusAnimationComponent =
    viewChild<AnimationComponent>('focusAnimation');

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

  ngAfterViewInit(): void {
    this.animationComponent()?.begin({ reverseOnceComplete: true });
  }

  ngOnDestroy(): void {
    this.model().destroy();
  }

  protected onMouseOver() {
    this.model().triggerBlockEvent(BlockEvent.hoverIn);

    this.hoverAnimationComponent()?.begin();
  }

  protected onMouseOut() {
    this.model().triggerBlockEvent(BlockEvent.hoverOut);

    this.hoverAnimationComponent()?.reverse();
  }

  protected onFocus() {
    this.model().triggerBlockEvent(BlockEvent.focusIn);

    this.focusAnimationComponent()?.begin();
  }

  protected onBlur() {
    this.model().triggerBlockEvent(BlockEvent.focusOut);

    this.focusAnimationComponent()?.reverse();
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
