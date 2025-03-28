import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { ContainerStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { DocViewComponent } from '../doc-view/doc-view.component';
import { ContainerViewModel } from '../../core/models/container-view.model';
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
  },
  providers: [provideComponent(ContainerComponent)],
})
export class ContainerComponent
  extends DocViewComponent<ContainerViewModel>
  implements OnInit
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

  private subscribeToViewUpdates(): void {
    this.model()
      .viewUpdate.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cd.markForCheck();
      });
  }

  protected modelFactory(): ContainerViewModel {
    return new ContainerViewModel(this, this.styleSheet());
  }
}
