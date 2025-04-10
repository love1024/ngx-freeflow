import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  runInInjectionContext,
  viewChildren,
} from '@angular/core';
import { ContainerStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { DocViewComponent } from '../doc-view/doc-view.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { provideComponent } from '../../core/utils/provide-component';
import { FilterService } from '../../core/services/filter.service';
import { AnimationGroupComponent } from '../animation-group/animation-group.component';
import { uuid } from '../../core/utils/uuid';
import { pairwise, tap } from 'rxjs';
import { Shadow } from '../../core/interfaces/filter.interface';

import { ContainerViewModel } from './container-view.model';
import { KeyValuePipe } from '@angular/common';
import { uiChanges } from '../../core/utils/ui-changes';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg[ff-container]',
  imports: [AnimationGroupComponent, KeyValuePipe],
  templateUrl: './container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.width]': 'model.width()',
    '[attr.height]': 'model.height()',
    '[attr.x]': 'model.x()',
    '[attr.y]': 'model.y()',
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
  extends DocViewComponent<ContainerViewModel, ContainerStyleSheet>
  implements OnInit, OnDestroy, AfterViewInit
{
  protected id = uuid();

  protected shadowUrl = computed(() => {
    const filter = this.model.filter();
    if (filter) {
      const shadowId = this.filterService.getShadowId(filter);
      return `url(#${shadowId})`;
    }

    return null;
  });

  private animationComponentList =
    viewChildren<AnimationGroupComponent>('animation');

  private filterService = inject(FilterService);
  private hostRef = inject<ElementRef<Element>>(ElementRef);

  constructor() {
    super();

    if (!this.parent) {
      throw new Error('block must not be used outside of doc root');
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.registerShadows();
  }

  ngAfterViewInit(): void {
    const changes$ = uiChanges(this.hostRef.nativeElement);
    runInInjectionContext(this.injector, () =>
      changes$
        .pipe(
          tap(snapshot => this.uiSnapshot.set(snapshot)),
          takeUntilDestroyed()
        )
        .subscribe()
    );

    const animationsBySelector = animationGroupHash(
      this.animationComponentList() as AnimationGroupComponent[]
    );

    // handle animations
    runInInjectionContext(this.injector, () =>
      changes$
        .pipe(
          pairwise(),
          tap(([oldSnapshot, newSnapshot]) => {
            // compare new shot and old. if old has no selector that appears in new then we should start animations
            newSnapshot.classes.forEach(c => {
              if (!oldSnapshot.classes.has(c)) animationsBySelector[c]?.begin();
            });

            // on the other hand we check if class is dissapear compared to old snapshot, so it's a sign to run back animation
            oldSnapshot.classes.forEach(c => {
              if (!newSnapshot.classes.has(c))
                animationsBySelector[c]?.reverse();
            });
          }),
          takeUntilDestroyed()
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.model.destroy();
  }

  protected modelFactory(): ContainerViewModel {
    return new ContainerViewModel(this.styleSheet);
  }

  protected defaultStyleSheet(): ContainerStyleSheet {
    return {};
  }

  private registerShadows() {
    console.log(this.model.filter());
    runInInjectionContext(this.injector, () => {
      toObservable(this.model.filter)
        .pipe(
          pairwise(),
          tap(([oldShadow, newShadow]) => {
            if (newShadow && !oldShadow) {
              this.filterService.addShadow(newShadow as Shadow);
            }
            if (!newShadow && oldShadow) {
              this.filterService.deleteShadow(oldShadow as Shadow);
            }
          }),
          takeUntilDestroyed()
        )
        .subscribe();
    });
  }
}

function animationGroupHash(groups: AnimationGroupComponent[]) {
  const animationsBySelector: Record<string, AnimationGroupComponent> = {};
  for (const g of groups) {
    const selector = g.selector();
    if (selector) {
      animationsBySelector[selector] = g;
    }
  }

  return animationsBySelector;
}
