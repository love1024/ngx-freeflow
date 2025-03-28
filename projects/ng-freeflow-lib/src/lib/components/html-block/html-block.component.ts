import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { DocViewComponent } from '../doc-view/doc-view.component';
import { HtmlViewModel } from '../../core/models/html-view.model';
import { HtmlStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { AnyViewModel } from '../../core/models/any-view.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'foreignObject[ff-html]',
  imports: [],
  templateUrl: './html-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DocViewComponent,
      useExisting: forwardRef(() => HtmlBlockComponent),
    },
  ],
  host: {
    '[attr.width]': 'model().width',
    '[attr.height]': 'model().width',
    '[attr.x]': 'model().x',
    '[attr.y]': 'model().y',
  },
})
export class HtmlBlockComponent
  extends DocViewComponent
  implements OnInit, OnDestroy
{
  styleSheet = input<HtmlStyleSheet>({});

  protected model!: Signal<HtmlViewModel>;

  private readonly zone = inject(NgZone);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly host =
    inject<ElementRef<SVGForeignObjectElement>>(ElementRef);

  private resizeObserver!: ResizeObserver;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.model = signal(this.createModel());

    this.resizeObserver = new ResizeObserver(([entry]) => {
      console.log(entry);
      this.zone.run(() => {
        this.model().setHeight(entry.contentRect.height);
        this.treeManager.calculateLayout();
      });
    });
    const el = this.host.nativeElement.firstElementChild;
    if (el) {
      this.resizeObserver.observe(el);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  protected modelFactory(): AnyViewModel {
    return new HtmlViewModel(this, this.styleSheet());
  }
}
