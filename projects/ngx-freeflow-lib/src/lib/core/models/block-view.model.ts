import { BlockStyleSheet } from '../../../public-api';
import { AnyViewModel } from './any-view.model';
import { computed, signal, WritableSignal } from '@angular/core';

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
  let width = root.width();

  chainFromRoot.filter(isBlock).forEach(item => {
    // we know width either from styles
    if (item.styleSheet.width()) {
      width = item.styleSheet.width();
    } else {
      // or if styles has no width, we compute it from margins
      if (typeof item.styleSheet.marginLeft() === 'number') {
        width -= item.styleSheet.marginLeft() as number;
      }

      if (typeof item.styleSheet.marginRight() === 'number') {
        width -= item.styleSheet.marginRight() as number;
      }
    }
  });

  return width;
};

export const styleSheetWithDefaults = (
  styles: BlockStyleSheet
): Required<BlockStyleSheet> => {
  return {
    width: styles.width ?? signal(0),
    height: styles.height ?? signal(0),
    marginLeft: styles.marginLeft ?? signal(0),
    marginRight: styles.marginRight ?? signal(0),
    marginBottom: styles.marginBottom ?? signal(0),
    marginTop: styles.marginTop ?? signal(0),
    boxShadow: styles.boxShadow ?? signal(null),
  };
};

export abstract class BlockViewModel extends AnyViewModel {
  public width = signal(0);
  public height = signal(0);
  public x = signal(0);
  public y = signal(0);
  public filter = computed(() => this.styleSheet.boxShadow());

  public abstract override styleSheet: Required<BlockStyleSheet>;

  calculateLayout() {
    this.children.forEach(c => c.calculateLayout());

    this.calculateHeight();
    this.calculateWidth();
    this.calculatePosition();
  }

  public setHeight(height: number) {
    (this.styleSheet.height as WritableSignal<number>).set(height);
  }

  protected calculatePosition() {
    if (!this.parent) return;

    let y = 0;
    y += this.styleSheet.marginTop();
    const prevSibling =
      this.parent.children[this.parent.children.indexOf(this) - 1];
    if (prevSibling && prevSibling instanceof BlockViewModel) {
      y +=
        prevSibling.y() +
        prevSibling.height() +
        prevSibling.styleSheet.marginBottom();
    }

    let x = 0;
    if (
      this.styleSheet.marginLeft() === 'auto' &&
      this.styleSheet.marginRight() === 'auto'
    ) {
      const parentWidth = getModelWidth(this.parent);
      x = parentWidth / 2 - this.width() / 2;
    } else if (
      typeof this.styleSheet.marginLeft() === 'number' &&
      typeof this.styleSheet.marginRight() === 'number'
    ) {
      x += this.styleSheet.marginLeft() as number;
    } else {
      x = 0;
    }

    this.x.set(x);
    this.y.set(y);
  }

  protected calculateWidth() {
    this.width.set(getModelWidth(this));
  }

  protected calculateHeight() {
    if (this.styleSheet.height()) {
      this.height.set(this.styleSheet.height());
    } else {
      let height = 0;
      for (const c of this.children) {
        if (c instanceof BlockViewModel) {
          height += c.height();
          height += c.styleSheet.marginBottom();
          height += c.styleSheet.marginTop();
        }
      }

      this.height.set(height);
    }
  }
}
