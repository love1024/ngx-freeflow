import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ContainerStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { DocViewComponent } from '../doc-view/doc-view.component';
import {
  ContainerViewModel,
  PsuedoEvent,
} from '../../core/models/container-view.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { provideComponent } from '../../core/utils/provide-component';

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
  },
  providers: [provideComponent(ContainerComponent)],
  styles: [
    `
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
  }

  ngOnDestroy(): void {
    this.model().destroy();
  }

  protected onMouseOver() {
    this.model().triggerPsuedoEvent(PsuedoEvent.hoverIn);
  }

  protected onMouseOut() {
    this.model().triggerPsuedoEvent(PsuedoEvent.hoverOut);
  }

  protected onFocus() {
    this.model().triggerPsuedoEvent(PsuedoEvent.focusIn);
  }

  protected onBlur() {
    this.model().triggerPsuedoEvent(PsuedoEvent.focusOut);
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
}
