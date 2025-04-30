import { Point } from './point.interface';

interface DefaultNode {
  type: 'default';
  text?: string;
}

interface HtmlTemplateNode<T = unknown> {
  type: 'html-template';
  data?: T;
}

interface SharedNode {
  id: string;
  point: Point;
  draggable?: boolean;
}

export type Node<T = unknown> = SharedNode &
  (DefaultNode | HtmlTemplateNode<T>);
