import { filter, map, merge, Observable, of, Subject, tap } from 'rxjs';
import { BlockStyleSheet } from '../../../public-api';
import { AnyViewModel } from './any-view.model';
import { StylePrioritizer, StylesSource } from '../utils/style-prioritizer';
import { Shadow } from '../interfaces/filter.interface';
import { signal } from '@angular/core';

export enum BlockEvent {
  hoverIn,
  hoverOut,
  focusIn,
  focusOut,
}

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
    boxShadow: styles.boxShadow ?? null,
    onHover: styles.onHover ?? null,
    onFocus: styles.onFocus ?? null,
  };
};

export abstract class BlockViewModel extends AnyViewModel {
  public width = 0;
  public height = 0;
  public x = 0;
  public y = 0;
  public filter = signal<Shadow | null>(null);

  public abstract override styleSheet: Required<BlockStyleSheet>;

  private blockEvent$ = new Subject<BlockEvent>();
  private prioritizer!: StylePrioritizer;

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

  public triggerBlockEvent(event: BlockEvent) {
    this.blockEvent$.next(event);
  }

  protected init() {
    this.prioritizer = new StylePrioritizer(this.styleSheet);

    this.subscription.add(this.registerEvents().subscribe());
  }

  protected abstract applyStyles(styles: BlockStyleSheet): void;

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

  private registerEvents(): Observable<void> {
    const hoverEvent$ = this.styleSheet.onHover
      ? this.blockEvent$.pipe(
          filter(evt =>
            [BlockEvent.hoverIn, BlockEvent.hoverOut].includes(evt)
          ),
          tap(evt =>
            this.toggleStyleSheet(
              StylesSource.hover,
              evt === BlockEvent.hoverIn,
              this.styleSheet.onHover!
            )
          )
        )
      : of(null);
    const focusEvent$ = this.styleSheet.onFocus
      ? this.blockEvent$.pipe(
          filter(evt =>
            [BlockEvent.focusIn, BlockEvent.focusOut].includes(evt)
          ),
          tap(evt =>
            this.toggleStyleSheet(
              StylesSource.focus,
              evt === BlockEvent.focusIn,
              this.styleSheet.onFocus!
            )
          )
        )
      : of(null);

    return merge(hoverEvent$, focusEvent$).pipe(map(() => undefined));
  }

  private toggleStyleSheet(
    source: StylesSource,
    enable: boolean,
    styles: BlockStyleSheet
  ) {
    if (enable) {
      this.applyStyles(styles);
      this.prioritizer.set(source);
    } else {
      this.applyStyles(this.prioritizer.getFallback(source));
      this.prioritizer.unset(source);
    }
  }
}
