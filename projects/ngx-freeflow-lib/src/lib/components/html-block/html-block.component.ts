import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { DocViewComponent } from '../doc-view/doc-view.component';

import { HtmlStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { provideComponent } from '../../core/utils/provide-component';
import { HtmlViewModel } from './html-view.model';
import { resizable } from '../../core/utils/resizable';
import { tap } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'foreignObject[ff-html]',
  imports: [],
  templateUrl: './html-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponent(HtmlBlockComponent)],
  host: {
    '[attr.width]': 'model.width()',
    '[attr.height]': 'model.height()',
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

  private readonly wrapperRef =
    viewChild<ElementRef<HTMLDivElement>>('wrapper');

  private resizeObserver!: ResizeObserver;

  override ngOnInit(): void {
    super.ngOnInit();

    const el = this.wrapperRef()?.nativeElement;
    if (!el) {
      return;
    }

    this.treeManager.calculateLayout();

    this.subscription.add(
      resizable(el, this.zone)
        .pipe(
          tap(entry => {
            const [box] = entry.borderBoxSize;
            this.model.setHeight(box.blockSize);

            // TODO research how to avoid needless calls
            this.treeManager.calculateLayout();
          })
        )
        .subscribe()
    );
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
