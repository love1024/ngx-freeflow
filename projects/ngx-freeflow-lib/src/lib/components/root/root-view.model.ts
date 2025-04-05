import { computed, signal } from '@angular/core';
import { AnyViewModel } from '../../core/models/any-view.model';
import { RootStyleSheet } from '../../../public-api';
import { BlockViewModel } from '../../core/models/block-view.model';

export class RootViewModel extends AnyViewModel {
  public width = computed(() => this.styleSheet.width());
  public height = signal(0);

  public readonly styleSheet: Required<RootStyleSheet>;

  constructor(styleSheet: RootStyleSheet) {
    super();

    this.styleSheet = styleSheetWithDefaults(styleSheet);
  }

  public calculateLayout(): void {
    this.children.forEach(c => c.calculateLayout());

    this.setHeight();
  }

  private setHeight() {
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

export function styleSheetWithDefaults(
  styles: RootStyleSheet
): Required<RootStyleSheet> {
  return {
    width: styles.width ?? signal(0),
    height: styles.height ?? signal(0),
  };
}
