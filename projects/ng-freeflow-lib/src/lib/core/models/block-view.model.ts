import { BlockStyleSheet } from '../../../public-api';
import { AnyViewModel } from './any-view.model';

export const isBlock = (model: AnyViewModel): model is BlockViewModel => {
  return model instanceof BlockViewModel;
};

const pathFromRoot = (startModel: AnyViewModel): AnyViewModel[] => {
  const chain: AnyViewModel[] = [];

  let current: AnyViewModel | null = startModel;
  while (current) {
    chain.push(current);
    current = current.parent;
  }

  return chain.reverse();
};

const getModelWidth = (model: AnyViewModel): number => {
  const chainFromRoot = pathFromRoot(model);

  const [root] = chainFromRoot;
  let width = root.width;

  chainFromRoot.filter(isBlock).forEach(item => {
    // we know width either from styles
    if (item.styleSheet.width) {
      width = item.styleSheet.width;
    } else {
      // or if styles has no width, we compute it from margins
      if (typeof item.styleSheet.marginLeft === 'number') {
        width -= item.styleSheet.marginLeft;
      }

      if (typeof item.styleSheet.marginRight === 'number') {
        width -= item.styleSheet.marginRight;
      }
    }
  });

  return width;
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

    let y = 0;
    y += this.styleSheet.marginTop;
    const prevSibling =
      this.parent.children[this.parent.children.indexOf(this) - 1];
    if (prevSibling && prevSibling instanceof BlockViewModel) {
      y +=
        prevSibling.y +
        prevSibling.height +
        prevSibling.styleSheet.marginBottom;
    }

    let x = 0;
    if (
      this.styleSheet.marginLeft === 'auto' &&
      this.styleSheet.marginRight === 'auto'
    ) {
      const parentWidth = getModelWidth(this.parent);
      x = parentWidth / 2 - this.width / 2;
    } else if (
      typeof this.styleSheet.marginLeft === 'number' &&
      typeof this.styleSheet.marginRight === 'number'
    ) {
      x += this.styleSheet.marginLeft;
    } else {
      x = 0;
    }

    this.x = x;
    this.y = y;
  }

  protected calculateWidth() {
    this.width = getModelWidth(this);
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
