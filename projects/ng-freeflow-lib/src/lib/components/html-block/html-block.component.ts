import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnInit,
  Optional,
  signal,
  Signal,
  SkipSelf,
} from '@angular/core';
import { DocViewComponent } from '../doc-view/doc-view.component';
import { HtmlViewModel } from '../../core/models/html-view.model';
import { HtmlStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { DocTreeBuilderService } from '../../core/services/doc-tree-builder.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'foreignObject[ff-html]',
  imports: [],
  templateUrl: './html-block.component.html',
  styleUrl: './html-block.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DocViewComponent,
      useExisting: forwardRef(() => HtmlBlockComponent),
    },
  ],
  host: {
    '[attr.width]': '"100%"',
    '[attr.height]': '"100%"',
  },
})
export class HtmlBlockComponent implements OnInit {
  styleSheet = input<HtmlStyleSheet>({});

  protected model!: Signal<HtmlViewModel>;

  private readonly treeManager = inject(DocTreeBuilderService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly host =
    inject<ElementRef<SVGForeignObjectElement>>(ElementRef);

  constructor(@SkipSelf() @Optional() private parent: DocViewComponent) {}

  ngOnInit(): void {
    this.model = signal(this.createModel());
  }

  createModel() {
    const model = new HtmlViewModel(this, this.styleSheet());

    // every vdoc-block must have parent (vdoc-root or other views)
    const parent = this.treeManager.getByComponent(this.parent);
    model.parent = parent;
    parent.children.push(model);

    this.treeManager.register(model);

    return model;
  }
}
