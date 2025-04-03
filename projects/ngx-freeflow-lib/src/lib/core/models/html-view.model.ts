import { DocViewComponent } from '../../components/doc-view/doc-view.component';
import { HtmlStyleSheet } from '../interfaces/stylesheet.interface';
import { BlockViewModel } from './block-view.model';
import { styleSheetWithDefaults as blockStyleSheetWithDefaults } from './block-view.model';

export const styleSheetWithDefaults = (
  styles: HtmlStyleSheet
): Required<HtmlStyleSheet> => {
  return {
    ...blockStyleSheetWithDefaults(styles),
  };
};

export class HtmlViewModel extends BlockViewModel {
  public styleSheet: Required<HtmlStyleSheet>;

  constructor(
    public component: DocViewComponent,
    styleSheet: HtmlStyleSheet
  ) {
    super();

    this.styleSheet = styleSheetWithDefaults(styleSheet);

    this.applyStyles(this.styleSheet);

    super.init();
  }

  protected override applyStyles(styles: HtmlStyleSheet): void {}
}
