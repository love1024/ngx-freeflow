import { Shadow } from './filter.interface';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StyleSheet {}

interface WithWidth {
  width: number;
}

interface WithHeight {
  height: number;
}

interface WithShadow {
  boxShadow: Shadow | null;
}

interface WithMargin {
  marginLeft: number | 'auto';
  marginRight: number | 'auto';
  marginTop: number;
  marginBottom: number;
}

export interface BlockStyleSheet
  extends StyleSheet,
    Partial<WithWidth>,
    Partial<WithHeight>,
    Partial<WithMargin>,
    Partial<WithShadow> {
  onHover?: this | null;
  onFocus?: this | null;
}

export interface RootStyleSheet
  extends StyleSheet,
    WithWidth,
    Partial<WithHeight> {}

export interface ContainerStyleSheet extends BlockStyleSheet {
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HtmlStyleSheet extends BlockStyleSheet {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ImageStyleSheet extends BlockStyleSheet {}
