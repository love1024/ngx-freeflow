import { Signal } from '@angular/core';
import { Animation } from './animation.interface';
import { Shadow } from './filter.interface';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StyleSheet {}

interface WithWidth {
  width: Signal<number>;
}

interface WithHeight {
  height: Signal<number>;
}

interface WithShadow {
  boxShadow: Signal<Shadow | null>;
}

interface WithMargin {
  marginLeft: Signal<number | 'auto'>;
  marginRight: Signal<number | 'auto'>;
  marginTop: Signal<number>;
  marginBottom: Signal<number>;
}

export interface BlockStyleSheet
  extends StyleSheet,
    Partial<WithWidth>,
    Partial<WithHeight>,
    Partial<WithMargin>,
    Partial<WithShadow> {}

export interface RootStyleSheet
  extends StyleSheet,
    WithWidth,
    Partial<WithHeight> {}

export interface ContainerStyleSheet extends BlockStyleSheet {
  backgroundColor?: Signal<string>;
  borderColor?: Signal<string>;
  borderRadius?: Signal<number>;
  borderWidth?: Signal<number>;
  // it's not a signal, because animation is statically defined and run on selector match
  animation?: Record<string, Animation | Animation[]>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HtmlStyleSheet extends BlockStyleSheet {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ImageStyleSheet extends BlockStyleSheet {}
