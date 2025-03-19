// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StyleSheet {}

interface WithWidth {
  width: number;
}

interface WithHeight {
  height: number;
}

export interface RootStyleSheet
  extends StyleSheet,
    WithWidth,
    Partial<WithHeight> {}

export interface BlockStyleSheet
  extends StyleSheet,
    WithWidth,
    Partial<WithHeight> {
  marginBottom: number;
  backgroundColor: string;
  borderRadius: number;
}
