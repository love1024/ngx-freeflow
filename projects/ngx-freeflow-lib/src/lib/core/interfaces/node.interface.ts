import { Point } from './point.interface';

export interface Node<T = unknown> {
  id: string;
  point: Point;
  type: 'default' | 'custom';
  data?: T;
}
