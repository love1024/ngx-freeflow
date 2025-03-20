import { DocViewComponent } from '../../components/doc-view/doc-view.component';
import { HtmlStyleSheet } from '../interfaces/stylesheet.interface';
import { BlockViewModel } from './block-view.model';

export class HtmlViewModel extends BlockViewModel {
  public styleSheet: Required<HtmlStyleSheet>;

  constructor(
    public component: DocViewComponent,
    styleSheet: HtmlStyleSheet
  ) {
    super();

    this.styleSheet = styleSheetWithDefaults(styleSheet);
  }
}

function styleSheetWithDefaults(
  styles: HtmlStyleSheet
): Required<HtmlStyleSheet> {
  return {
    width: styles.width ?? 0,
    height: styles.height ?? 0,
    marginLeft: styles.marginLeft ?? 0,
    marginRight: styles.marginRight ?? 0,
    marginBottom: styles.marginBottom ?? 0,
    marginTop: styles.marginTop ?? 0,
    ...styles,
  };
}
