import { Point } from './point.interface';

interface DefaultNode {
  type: 'default';
  text?: string;
}

interface HtmlTemplateNode<T = unknown> {
  type: 'html-template';
  data?: T;
}

export type Node<T = unknown> = {
  id: string;
  point: Point;
} & (DefaultNode | HtmlTemplateNode<T>);
