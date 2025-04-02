import { DocViewComponent } from '../../components/doc-view/doc-view.component';
import { ContainerStyleSheet } from '../interfaces/stylesheet.interface';
import { BlockViewModel } from './block-view.model';
import { styleSheetWithDefaults as blockStyleSheetWithDefaults } from './block-view.model';

const styleSheetWithDefaults = (
  styleSheet: ContainerStyleSheet
): Required<ContainerStyleSheet> => {
  return {
    ...blockStyleSheetWithDefaults(styleSheet),
    borderColor: styleSheet.borderColor ?? '',
    borderWidth: styleSheet.borderWidth ?? 0,
    borderRadius: styleSheet.borderRadius ?? 0,
    backgroundColor: styleSheet.backgroundColor ?? '',
  };
};

export class ContainerViewModel extends BlockViewModel {
  public contentHeight = 0;
  public contentWidth = 0;
  public contentX = 0;
  public contentY = 0;
  public borderColor = '';
  public borderWidth = 0;
  public backgroundColor = '';
  public borderRadius = 0;

  public styleSheet: Required<ContainerStyleSheet>;

  constructor(
    public component: DocViewComponent,
    styleSheet: ContainerStyleSheet
  ) {
    super();

    this.styleSheet = styleSheetWithDefaults(styleSheet);

    this.applyStyles(this.styleSheet);

    super.init();
  }

  protected override applyStyles(styles: ContainerStyleSheet): void {
    if (styles.borderColor) {
      this.borderColor = styles.borderColor;
    }

    if (styles.borderRadius) {
      this.borderRadius = styles.borderRadius;
    }

    if (styles.borderWidth) {
      this.borderWidth = styles.borderWidth;
    }

    if (styles.backgroundColor) {
      this.backgroundColor = styles.backgroundColor;
    }

    this.filter.set(styles.boxShadow ?? null);
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
