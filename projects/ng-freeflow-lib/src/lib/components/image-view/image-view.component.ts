import {
  Component,
  input,
  OnInit,
  Optional,
  signal,
  Signal,
  SkipSelf,
} from '@angular/core';
import { ImageStyleSheet } from '../../../public-api';
import { ImageViewModel } from '../../core/models/image-view.model';
import { DocViewComponent } from '../doc-view/doc-view.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'svg[ff-image]',
  imports: [],
  templateUrl: './image-view.component.html',
  styleUrl: './image-view.component.css',
  host: {
    '[attr.width]': 'model().width',
    '[attr.height]': 'model().width',
    '[attr.x]': 'model().x',
    '[attr.y]': 'model().y',
  },
})
export class ImageViewComponent extends DocViewComponent implements OnInit {
  styleSheet = input<ImageStyleSheet>({});
  src = input<string>();

  protected model!: Signal<ImageViewModel>;

  constructor(@SkipSelf() @Optional() protected parent: DocViewComponent) {
    super();
  }

  ngOnInit(): void {
    this.model = signal(this.createModel());
  }

  protected modelFactory(): ImageViewModel {
    return new ImageViewModel(this, this.styleSheet());
  }
}
