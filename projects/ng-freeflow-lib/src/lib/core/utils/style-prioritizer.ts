import { ContainerStyleSheet } from '../interfaces/stylesheet.interface';

export enum StylesPriority {
  hover,
  focus,
  styleSheet,
}

type ElementStyleSheets = Record<StylesPriority, ContainerStyleSheet | null>;

export class StylePrioritizer {
  private styleStateMachine = {
    [StylesPriority.focus]: {
      fallbackStyle: StylesPriority.styleSheet,
      isSet: false,
    },
    [StylesPriority.hover]: {
      fallbackStyle: StylesPriority.focus,
      isSet: false,
    },
    [StylesPriority.styleSheet]: {
      fallbackStyle: StylesPriority.styleSheet,
      isSet: true,
    },
  };

  private readonly elementStyles: ElementStyleSheets;

  constructor(styleSheet: Required<ContainerStyleSheet>) {
    this.elementStyles = {
      [StylesPriority.styleSheet]: styleSheet,
      [StylesPriority.focus]: styleSheet.onFocus,
      [StylesPriority.hover]: styleSheet.onHover,
    };
  }

  public set(current: StylesPriority) {
    this.styleStateMachine[current].isSet = true;
  }

  public unset(current: StylesPriority) {
    this.styleStateMachine[current].isSet = false;
  }

  public getFallback(current: StylesPriority): ContainerStyleSheet {
    const fallback =
      this.elementStyles[this.styleStateMachine[current].fallbackStyle];
    const isSet =
      this.styleStateMachine[this.styleStateMachine[current].fallbackStyle]
        .isSet;

    if (fallback && isSet) {
      return fallback;
    }

    return this.getFallback(this.styleStateMachine[current].fallbackStyle);
  }
}
