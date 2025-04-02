import { BlockStyleSheet } from '../interfaces/stylesheet.interface';

export enum StylesSource {
  hover,
  focus,
  styleSheet,
}

export class StylePrioritizer {
  private styleStateMachine = {
    [StylesSource.hover]: {
      fallbackStyle: StylesSource.focus,
      isSet: false,
    },
    [StylesSource.focus]: {
      fallbackStyle: StylesSource.styleSheet,
      isSet: false,
    },
    [StylesSource.styleSheet]: {
      fallbackStyle: StylesSource.styleSheet,
      isSet: true, // activated always
    },
  };

  private readonly elementStyles: Record<StylesSource, BlockStyleSheet | null>;

  constructor(styleSheet: Required<BlockStyleSheet>) {
    this.elementStyles = {
      [StylesSource.styleSheet]: styleSheet,
      [StylesSource.focus]: styleSheet.onFocus,
      [StylesSource.hover]: styleSheet.onHover,
    };
  }

  public set(current: StylesSource) {
    this.styleStateMachine[current].isSet = true;
  }

  public unset(current: StylesSource) {
    this.styleStateMachine[current].isSet = false;
  }

  public getFallback(current: StylesSource): BlockStyleSheet {
    const fallbackSource = this.styleStateMachine[current].fallbackStyle;
    const fallbackStyles = this.elementStyles[fallbackSource];
    const isSet = this.styleStateMachine[fallbackSource].isSet;

    if (fallbackStyles && isSet) {
      return fallbackStyles;
    }

    return this.getFallback(fallbackSource);
  }
}
