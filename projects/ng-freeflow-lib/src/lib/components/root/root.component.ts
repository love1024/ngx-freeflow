import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
} from '@angular/core';

import { RootViewModel } from '../../core/models/root-view.model';
import { DocViewComponent } from '../doc-view/doc-view.component';
import { RootStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { provideComponent } from '../../core/utils/provide-component';
import { FilterService } from '../../core/services/filter.service';
import { KeyValuePipe } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg[ff-root]',
  imports: [KeyValuePipe],
  templateUrl: './root.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.width]': 'model().width',
    '[attr.height]': 'model().height',
  },
  providers: [provideComponent(RootComponent)],
})
export class RootComponent
  extends DocViewComponent<RootViewModel>
  implements AfterContentInit
{
  styleSheet = input.required<RootStyleSheet>();

  protected filterService = inject(FilterService);
  private cd = inject(ChangeDetectorRef);

  ngAfterContentInit(): void {
    this.treeManager.root?.calculateLayout();
    this.cd.markForCheck();
  }

  protected modelFactory(): RootViewModel {
    return new RootViewModel(this, this.styleSheet());
  }
}
