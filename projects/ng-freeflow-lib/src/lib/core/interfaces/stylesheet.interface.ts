// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StyleSheet {}

interface WithWidth {
  width: number;
}

interface WithHeight {
  height: number;
}

interface WithMargin {
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
}

export interface BlockStyleSheet
  extends StyleSheet,
    Partial<WithWidth>,
    Partial<WithHeight>,
    Partial<WithMargin> {}

export interface RootStyleSheet
  extends StyleSheet,
    WithWidth,
    Partial<WithHeight> {}

export interface ContainerStyleSheet extends BlockStyleSheet {
  backgroundColor: string;
  borderRadius: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HtmlStyleSheet extends BlockStyleSheet {}
