import { ImageStyleSheet } from '../../core/interfaces/stylesheet.interface';
import { BlockViewModel } from '../../core/models/block-view.model';
import { styleSheetWithDefaults as blockStyleSheetWithDefaults } from '../../core/models/block-view.model';

const styleSheetWithDefaults = (
  styles: ImageStyleSheet
): Required<ImageStyleSheet> => {
  return {
    ...blockStyleSheetWithDefaults(styles),
  };
};

export class ImageViewModel extends BlockViewModel {
  public styleSheet: Required<ImageStyleSheet>;

  constructor(styleSheet: ImageStyleSheet) {
    super();

    this.styleSheet = styleSheetWithDefaults(styleSheet);
  }
}
