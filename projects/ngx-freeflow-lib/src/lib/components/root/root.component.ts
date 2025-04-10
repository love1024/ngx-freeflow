import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { DocViewComponent } from '../doc-view/doc-view.component';
import { RootStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { provideComponent } from '../../core/utils/provide-component';
import { FilterService } from '../../core/services/filter.service';
import { KeyValuePipe } from '@angular/common';
import { RootViewModel } from './root-view.model';
import { DocTreeBuilderService } from '../../core/services/doc-tree-builder.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg[ff-root]',
  imports: [KeyValuePipe],
  templateUrl: './root.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.width]': 'model.width()',
    '[attr.height]': 'model.height()',
  },
  providers: [provideComponent(RootComponent), DocTreeBuilderService],
})
export class RootComponent
  extends DocViewComponent<RootViewModel, RootStyleSheet>
  implements AfterContentInit, AfterViewChecked
{
  protected filterService = inject(FilterService);

  ngAfterContentInit(): void {
    this.treeManager.root?.calculateLayout();
    this.cd.markForCheck();
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  protected modelFactory(): RootViewModel {
    return new RootViewModel(this.styleSheet);
  }

  protected defaultStyleSheet(): RootStyleSheet {
    return { width: signal(200) };
  }

  protected trackByShadowHash(_: number, { key }: { key: number }) {
    return key;
  }
}
