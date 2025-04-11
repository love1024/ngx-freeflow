import { Injectable, signal } from '@angular/core';

@Injectable()
export class ZoomService {
  public readonly zoom = signal(1);
  public readonly pan = signal({ x: 0, y: 0 });

  public readonly zoomPan = signal({ zoom: 1, x: 0, y: 0 });
}
