import { BlockComponent } from '../../../public-api';
import { ContainerStyleSheet } from '../interfaces/stylesheet.interface';
import { BlockViewModel } from './block-view.model';

const styleSheetWithDefaults = (
  styleSheet: ContainerStyleSheet
): Required<ContainerStyleSheet> => {
  return {
    width: 0,
    height: 0,
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    ...styleSheet,
  };
};

export class ContainerViewModel extends BlockViewModel {
  public readonly styleSheet: Required<ContainerStyleSheet>;

  constructor(
    public readonly component: BlockComponent,
    styleSheet: ContainerStyleSheet
  ) {
    super();

    this.styleSheet = styleSheetWithDefaults(styleSheet);
  }
}
