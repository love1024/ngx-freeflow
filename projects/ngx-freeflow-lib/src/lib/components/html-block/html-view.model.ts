import { HtmlStyleSheet } from '../../../public-api';
import { BlockViewModel } from '../../core/models/block-view.model';
import { styleSheetWithDefaults as blockStyleSheetWithDefaults } from '../../core/models/block-view.model';

export const styleSheetWithDefaults = (
  styles: HtmlStyleSheet
): Required<HtmlStyleSheet> => {
  return {
    ...blockStyleSheetWithDefaults(styles),
  };
};

export class HtmlViewModel extends BlockViewModel {
  public styleSheet: Required<HtmlStyleSheet>;

  constructor(styleSheet: HtmlStyleSheet) {
    super();

    this.styleSheet = styleSheetWithDefaults(styleSheet);
  }
}
