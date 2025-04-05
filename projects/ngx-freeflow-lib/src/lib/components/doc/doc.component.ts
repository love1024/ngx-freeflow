import { Directive, OnInit, signal } from '@angular/core';
import { DocViewComponent } from '../doc-view/doc-view.component';
import { BlockStyleSheet } from '../../../public-api';
import { ComponentViewModel } from './component-view.model';

@Directive({
  host: {
    '[attr.width]': 'model.width()',
    '[attr.height]': 'model.height()',
    '[attr.x]': 'model.x()',
    '[attr.y]': 'model.y()',
    '[style.filter]': 'model.filter()',
    '[style.overflow]': 'overflow()',
  },
})
export class DocComponent
  extends DocViewComponent<ComponentViewModel, BlockStyleSheet>
  implements OnInit
{
  constructor() {
    super();

    if (!this.parent) {
      throw new Error('Injection error');
    }
  }

  protected overflow = signal('visible');

  protected modelFactory(): ComponentViewModel {
    return new ComponentViewModel(this.styleSheet);
  }

  protected defaultStyleSheet(): BlockStyleSheet {
    return {};
  }
}
