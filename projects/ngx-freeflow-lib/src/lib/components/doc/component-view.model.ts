import { BlockStyleSheet } from '../../core/interfaces/stylesheet.interface';
import {
  BlockViewModel,
  styleSheetWithDefaults,
} from '../../core/models/block-view.model';

export class ComponentViewModel extends BlockViewModel {
  public styleSheet: Required<BlockStyleSheet>;

  constructor(styleSheet: BlockStyleSheet) {
    super();

    this.styleSheet = styleSheetWithDefaults(styleSheet);
  }
}
