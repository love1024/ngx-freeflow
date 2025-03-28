import { DocViewComponent } from '../../components/doc-view/doc-view.component';
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
    borderColor: '',
    borderWidth: 0,
    borderRadius: 0,
    ...styleSheet,
  };
};

export class ContainerViewModel extends BlockViewModel {
  public contentHeight = 0;
  public contentWidth = 0;
  public contentX = 0;
  public contentY = 0;

  public styleSheet: Required<ContainerStyleSheet>;

  constructor(
    public component: DocViewComponent,
    styleSheet: ContainerStyleSheet
  ) {
    super();

    this.styleSheet = styleSheetWithDefaults(styleSheet);
  }

  protected override calculateHeight(): void {
    super.calculateHeight();

    this.contentHeight = this.height - this.styleSheet.borderWidth;
  }

  protected override calculateWidth(): void {
    super.calculateWidth();

    this.contentWidth = this.width - this.styleSheet.borderWidth;
  }

  protected override calculatePosition(): void {
    super.calculatePosition();

    this.contentX = this.styleSheet.borderWidth / 2;
    this.contentY = this.styleSheet.borderWidth / 2;
  }
}
