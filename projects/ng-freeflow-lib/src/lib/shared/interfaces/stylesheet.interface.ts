// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StyleSheet {}

export interface BlockStyleSheet extends StyleSheet {
  width: number;
  height: number;
  marginBottom: number;
  backgroundColor: string;
  borderRadius: number;
}
