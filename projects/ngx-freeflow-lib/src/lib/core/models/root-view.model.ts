import { DocViewComponent } from '../../components/doc-view/doc-view.component';
import { RootStyleSheet } from '../interfaces/stylesheet.interface';
import { AnyViewModel } from './any-view.model';
import { BlockViewModel } from './block-view.model';

export class RootViewModel extends AnyViewModel {
  width: number;
  height = 0;

  constructor(
    public readonly component: DocViewComponent,
    public readonly styleSheet: RootStyleSheet
  ) {
    super();

    this.width = styleSheet.width;
  }

  public calculateLayout(): void {
    this.children.forEach(c => c.calculateLayout());

    this.setHeight();
  }

  private setHeight() {
    if (this.styleSheet.height) {
      this.height = this.styleSheet.height;
    } else {
      let height = 0;

      for (const c of this.children) {
        if (c instanceof BlockViewModel) {
          height += c.height;
          height += c.styleSheet.marginBottom;
        }
      }

      this.height = height;
    }
  }
}
