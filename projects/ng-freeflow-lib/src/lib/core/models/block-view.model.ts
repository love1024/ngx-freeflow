import { BlockComponent, BlockStyleSheet } from '../../../public-api';
import { AnyViewModel } from './any-view.model';

export class BlockViewModel extends AnyViewModel {
  public width = 0;
  public height = 0;
  public x = 0;
  public y = 0;

  constructor(
    public readonly component: BlockComponent,
    public readonly styleSheet: BlockStyleSheet
  ) {
    super();

    this.width = this.styleSheet.width;
  }

  calculateLayout() {
    this.children.forEach(c => c.calculateLayout());

    this.setPosition();
    this.setHeight();

    console.log(this.component, this.height);
  }

  private setPosition() {
    if (!this.parent) return;

    const prevSibling =
      this.parent.children[this.parent.children.indexOf(this) - 1];
    if (prevSibling && prevSibling instanceof BlockViewModel) {
      this.y =
        prevSibling.y +
        prevSibling.height +
        prevSibling.styleSheet.marginBottom;
    }
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
