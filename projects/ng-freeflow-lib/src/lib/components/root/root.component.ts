import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { DocTreeBuilderService } from '../../core/services/doc-tree-builder.service';
import { RootViewModel } from '../../core/models/root-view.model';
import { DocViewComponent } from '../doc-view/doc-view.component';
import { RootStyleSheet } from '../../../public-api';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg[ff-root]',
  imports: [],
  templateUrl: './root.component.html',
  styleUrl: './root.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.width]': 'model().width',
    '[attr.height]': 'model().height',
  },
  providers: [
    {
      provide: DocViewComponent,
      useExisting: forwardRef(() => RootComponent),
    },
  ],
})
export class RootComponent implements OnInit, AfterContentInit {
  styleSheet = input.required<RootStyleSheet>();

  model!: Signal<RootViewModel>;

  private treeManager = inject(DocTreeBuilderService);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.model = signal(new RootViewModel(this, this.styleSheet()));
    this.treeManager.register(this.model());
  }

  ngAfterContentInit(): void {
    this.treeManager.root?.calculateLayout();
    this.cd.markForCheck();
  }
}
