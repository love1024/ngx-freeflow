import { DocViewComponent } from '../../components/doc-view/doc-view.component';
import { BlockStyleSheet } from '../interfaces/stylesheet.interface';
import { BlockViewModel, styleSheetWithDefaults } from './block-view.model';

export class ComponentViewModel extends BlockViewModel {
  public styleSheet: Required<BlockStyleSheet>;

  constructor(
    public component: DocViewComponent,
    styleSheet: BlockStyleSheet
  ) {
    super();

    this.styleSheet = styleSheetWithDefaults(styleSheet);
  }
}
