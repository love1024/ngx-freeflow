export type ViewportChangeType =
  | 'initial' // first change, set by library
  | 'absolute' // later absolute value changes, set by user
  | 'relative'; // later relative value changes, set by user
