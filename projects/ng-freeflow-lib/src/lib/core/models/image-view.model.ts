import { DocViewComponent } from '../../components/doc-view/doc-view.component';
import { ImageStyleSheet } from '../interfaces/stylesheet.interface';
import { BlockViewModel } from './block-view.model';
import { styleSheetWithDefaults as blockStyleSheetWithDefaults } from './block-view.model';

const styleSheetWithDefaults = (
  styles: ImageStyleSheet
): Required<ImageStyleSheet> => {
  return {
    ...blockStyleSheetWithDefaults(styles),
  };
};

export class ImageViewModel extends BlockViewModel {
  public styleSheet: Required<ImageStyleSheet>;

  constructor(
    public component: DocViewComponent,
    styleSheet: ImageStyleSheet
  ) {
    super();

    this.styleSheet = styleSheetWithDefaults(styleSheet);
  }

  protected override applyStyles(styles: ImageStyleSheet): void {}
}
