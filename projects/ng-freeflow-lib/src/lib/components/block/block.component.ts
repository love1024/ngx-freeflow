import {
  ChangeDetectionStrategy,
  Component,
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
import { DocTreeBuilderService } from '../../core/services/doc-tree-builder.service';
import { DocViewComponent } from '../doc-view/doc-view.component';
import { BlockViewModel } from '../../core/models/block-view.model';
import { ContainerViewModel } from '../../core/models/container-view.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg[ff-block]',
  imports: [],
  templateUrl: './block.component.html',
  styleUrl: './block.component.css',
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
      useExisting: forwardRef(() => BlockComponent),
    },
  ],
})
export class BlockComponent implements OnInit {
  styleSheet = input.required<ContainerStyleSheet>();

  protected model!: Signal<BlockViewModel>;
  protected radiusX = signal(0);
  protected fillColor = signal('');

  private treeManager = inject(DocTreeBuilderService);

  constructor(@SkipSelf() @Optional() private parent: DocViewComponent) {
    if (!this.parent) {
      throw new Error('block must not be used outside of doc root');
    }
  }

  ngOnInit(): void {
    this.model = signal(this.createModel());

    this.fillColor.set(this.styleSheet().backgroundColor);
    this.radiusX.set(this.styleSheet().borderRadius);
  }

  private createModel() {
    const model = new ContainerViewModel(this, this.styleSheet());

    const parent = this.treeManager.getByComponent(this.parent);
    model.parent = parent;
    parent.children.push(model);

    this.treeManager.register(model);

    return model;
  }
}
