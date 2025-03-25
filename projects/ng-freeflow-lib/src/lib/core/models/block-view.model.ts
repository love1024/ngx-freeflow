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

export const styleSheetWithDefaults = (
  styles: BlockStyleSheet
): Required<BlockStyleSheet> => {
  return {
    width: styles.width ?? 0,
    height: styles.height ?? 0,
    marginLeft: styles.marginLeft ?? 0,
    marginRight: styles.marginRight ?? 0,
    marginBottom: styles.marginBottom ?? 0,
    marginTop: styles.marginTop ?? 0,
    ...styles,
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

    this.calculatePosition();
    this.calculateHeight();
    this.calculateWidth();

    this.updateView();
  }

  public setHeight(height: number) {
    this.styleSheet.height = height;
  }

  protected calculatePosition() {
    if (!this.parent) return;

    const prevSibling =
      this.parent.children[this.parent.children.indexOf(this) - 1];

    let x = 0;
    let y = 0;

    y += this.styleSheet.marginTop;
    x += this.styleSheet.marginLeft;

    if (prevSibling && prevSibling instanceof BlockViewModel) {
      y +=
        prevSibling.y +
        prevSibling.height +
        prevSibling.styleSheet.marginBottom;
    }

    this.x = x;
    this.y = y;
  }

  protected calculateWidth() {
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

  protected calculateHeight() {
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
