import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DocViewComponent } from '../doc-view/doc-view.component';

import { HtmlStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { provideComponent } from '../../core/utils/provide-component';
import { HtmlViewModel } from './html-view.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'foreignObject[ff-html]',
  imports: [],
  templateUrl: './html-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponent(HtmlBlockComponent)],
  host: {
    '[attr.width]': 'model.width()',
    '[attr.height]': 'model.width()',
    '[attr.x]': 'model.x()',
    '[attr.y]': 'model.y()',
    '[style.filter]': 'model.filter()',
  },
})
export class HtmlBlockComponent
  extends DocViewComponent<HtmlViewModel, HtmlStyleSheet>
  implements OnInit, OnDestroy
{
  private readonly zone = inject(NgZone);
  private readonly host =
    inject<ElementRef<SVGForeignObjectElement>>(ElementRef);

  private resizeObserver!: ResizeObserver;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.treeManager.calculateLayout();

    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.zone.run(() => {
        const [box] = entry.borderBoxSize;
        this.model.setHeight(box.blockSize);
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

  protected defaultStyleSheet(): HtmlStyleSheet {
    return {};
  }

  protected modelFactory(): HtmlViewModel {
    return new HtmlViewModel(this.styleSheet);
  }
}
