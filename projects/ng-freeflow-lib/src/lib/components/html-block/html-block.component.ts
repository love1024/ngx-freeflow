import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DocViewComponent } from '../doc-view/doc-view.component';
import { HtmlViewModel } from '../../core/models/html-view.model';
import { HtmlStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { provideComponent } from '../../core/utils/provide-component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'foreignObject[ff-html]',
  imports: [],
  templateUrl: './html-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponent(HtmlBlockComponent)],
  host: {
    '[attr.width]': 'model().width',
    '[attr.height]': 'model().width',
    '[attr.x]': 'model().x',
    '[attr.y]': 'model().y',
  },
})
export class HtmlBlockComponent
  extends DocViewComponent<HtmlViewModel>
  implements OnInit, OnDestroy
{
  styleSheet = input<HtmlStyleSheet>({});

  private readonly zone = inject(NgZone);
  private readonly host =
    inject<ElementRef<SVGForeignObjectElement>>(ElementRef);

  private resizeObserver!: ResizeObserver;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.zone.run(() => {
        const [box] = entry.borderBoxSize;
        this.model().setHeight(box.blockSize);
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

  protected modelFactory(): HtmlViewModel {
    return new HtmlViewModel(this, this.styleSheet());
  }
}
