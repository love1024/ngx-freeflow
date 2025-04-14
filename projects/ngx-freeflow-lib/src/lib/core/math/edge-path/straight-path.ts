import { Point } from '../../interfaces/point.interface';
import { UsingPoints } from '../../types/using-points.type';
import { path as d3Path } from 'd3-path';

export function straightPath(
  source: Point,
  target: Point,
  usingPoints: UsingPoints = [false, false, false]
) {
  const [start, center, end] = usingPoints;
  const nullPoint = { x: 0, y: 0 };

  const path = d3Path();
  path.moveTo(source.x, source.y);
  path.lineTo(target.x, target.y);

  return {
    path: path.toString(),
    points: {
      start: start ? getPointByRatio(source, target, 0.15) : nullPoint,
      center: center ? getPointByRatio(source, target, 0.5) : nullPoint,
      end: end ? getPointByRatio(source, target, 0.85) : nullPoint,
    },
  };
}

function getPointByRatio(source: Point, target: Point, ratio: number) {
  return {
    x: source.x + (target.x - source.x) * ratio,
    y: source.y + (target.y - source.y) * ratio,
  };
}
