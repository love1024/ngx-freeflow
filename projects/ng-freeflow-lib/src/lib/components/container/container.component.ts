import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  input,
  OnInit,
  Optional,
  Signal,
  signal,
  SkipSelf,
} from '@angular/core';
import { ContainerStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { DocViewComponent } from '../doc-view/doc-view.component';
import { BlockViewModel } from '../../core/models/block-view.model';
import { ContainerViewModel } from '../../core/models/container-view.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  providers: [
    {
      provide: DocViewComponent,
      useExisting: forwardRef(() => ContainerComponent),
    },
  ],
})
export class ContainerComponent extends DocViewComponent implements OnInit {
  styleSheet = input.required<ContainerStyleSheet>();

  protected model!: Signal<BlockViewModel>;

  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  constructor(@SkipSelf() @Optional() protected parent: DocViewComponent) {
    super();

    if (!this.parent) {
      throw new Error('block must not be used outside of doc root');
    }
  }

  ngOnInit(): void {
    this.model = signal(this.createModel());

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
