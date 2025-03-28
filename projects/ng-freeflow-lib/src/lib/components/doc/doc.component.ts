import { Directive, input, OnInit, signal, Signal } from '@angular/core';
import { DocViewComponent } from '../doc-view/doc-view.component';
import { BlockStyleSheet } from '../../../public-api';
import { ComponentViewModel } from '../../core/models/component-view.model';
import { AnyViewModel } from '../../core/models/any-view.model';

@Directive({
  host: {
    '[attr.width]': 'model().width',
    '[attr.height]': 'model().height',
    '[attr.x]': 'model().x',
    '[attr.y]': 'model().y',
  },
})
export class DocComponent extends DocViewComponent implements OnInit {
  styleSheet = input<BlockStyleSheet>({});

  protected model!: Signal<ComponentViewModel>;

  constructor() {
    super();

    if (!this.parent) {
      throw new Error('Injection error');
    }
  }

  ngOnInit() {
    this.model = signal(this.createModel());
  }

  protected modelFactory(): AnyViewModel {
    return new ComponentViewModel(this, this.styleSheet());
  }
}
