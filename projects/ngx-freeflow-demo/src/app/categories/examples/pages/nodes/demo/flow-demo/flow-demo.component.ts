import { Component, computed, signal } from '@angular/core';
import {
  ContainerComponent,
  ContainerStyleSheetFn,
  FlowComponent,
  hasClasses,
  HtmlBlockComponent,
  Node,
  RootComponent,
  RootStyleSheetFn,
  uuid,
} from 'ngx-freeflow-lib';

@Component({
  selector: 'ffd-flow-demo',
  imports: [
    FlowComponent,
    RootComponent,
    ContainerComponent,
    HtmlBlockComponent,
  ],
  templateUrl: './flow-demo.component.html',
  styleUrl: './flow-demo.component.scss',
})
export class FlowDemoComponent {
  public nodes: Node[] = [
    {
      id: uuid(),
      type: 'custom',
      position: { x: 10, y: 10 },
    },
    {
      id: uuid(),
      type: 'custom',
      position: { x: 100, y: 100 },
    },
  ];

  public styles = { root, container };
}

const root: RootStyleSheetFn = () => ({
  width: signal(200),
});

const container: ContainerStyleSheetFn = snapshot => ({
  width: signal(180),
  borderRadius: signal(5),
  backgroundColor: signal('rgb(30 30 30)'),
  marginBottom: signal(10),
  boxShadow: computed(() => {
    if (hasClasses(snapshot(), ':hover')) {
      return {
        hOffset: 3,
        vOffset: 5,
        blur: 3,
        color: 'rgb(255 0 0 / 0.4)',
      };
    }

    return null;
  }),
});
