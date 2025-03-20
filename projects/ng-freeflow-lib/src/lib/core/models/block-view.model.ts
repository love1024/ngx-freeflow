import { BlockStyleSheet } from '../../../public-api';
import { AnyViewModel } from './any-view.model';

export const isBlock = (model: AnyViewModel): model is BlockViewModel => {
  return model instanceof BlockViewModel;
};

const flatToRoot = (startModel: AnyViewModel): AnyViewModel[] => {
  const chain: AnyViewModel[] = [];

  let current: AnyViewModel | null = startModel;
  while (current) {
    chain.push(current);
    current = current.parent;
  }

  return chain.reverse();
};

const styleSheetWithDefaults = (
  styleSheet: BlockStyleSheet
): Required<BlockStyleSheet> => {
  return {
    width: 0,
    height: 0,
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    ...styleSheet,
  };
};

export abstract class BlockViewModel extends AnyViewModel {
  public width = 0;
  public height = 0;
  public x = 0;
  public y = 0;

  public abstract override styleSheet: Required<BlockStyleSheet>;

  calculateLayout() {
    this.children.forEach(c => c.calculateLayout());

    this.setPosition();
    this.setHeight();
    this.setWidth();
  }

  protected setPosition() {
    if (!this.parent) return;

    const prevSibling =
      this.parent.children[this.parent.children.indexOf(this) - 1];

    // Add own margin top
    this.y += this.styleSheet.marginTop;
    this.x += this.styleSheet.marginLeft;

    if (prevSibling && prevSibling instanceof BlockViewModel) {
      this.y +=
        prevSibling.y +
        prevSibling.height +
        prevSibling.styleSheet.marginBottom;
    }
  }

  public setWidth() {
    if (this.styleSheet.width) {
      this.width = this.styleSheet.width;
    } else {
      const chainFromRoot = flatToRoot(this);

      const [root] = chainFromRoot;
      let width = root.width;

      chainFromRoot.filter(isBlock).forEach(block => {
        width =
          width - block.styleSheet.marginLeft - block.styleSheet.marginRight;
      });

      this.width = width;
    }
  }

  public setHeight() {
    if (this.styleSheet.height) {
      this.height = this.styleSheet.height;
    } else {
      let height = 0;
      for (const c of this.children) {
        if (c instanceof BlockViewModel) {
          height += c.height;
          height += c.styleSheet.marginBottom;
          height += c.styleSheet.marginTop;
        }
      }

      this.height = height;
    }
  }
}
