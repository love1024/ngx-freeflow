import { Component, input } from '@angular/core';
import { provideComponent } from '../../core/utils/provide-component';
import { ImageStyleSheet } from '../../core/interfaces/stylesheet.interface';
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
    '[style.filter]': 'model().filter',
  },
  providers: [provideComponent(ImageViewComponent)],
})
export class ImageViewComponent extends DocViewComponent<ImageViewModel> {
  styleSheet = input<ImageStyleSheet>({});
  src = input<string>();

  constructor() {
    super();
  }

  protected modelFactory(): ImageViewModel {
    return new ImageViewModel(this, this.styleSheet());
  }
}
