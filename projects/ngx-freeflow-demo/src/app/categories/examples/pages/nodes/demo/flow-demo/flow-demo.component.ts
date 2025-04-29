import { Component, computed, Signal, signal } from '@angular/core';
import {
  Connection,
  ContainerStyleSheetFn,
  Edge,
  FlowComponent,
  hasClasses,
  Node,
  RootStyleSheetFn,
  UISnapshot,
  uuid,
} from 'ngx-freeflow-lib';

@Component({
  selector: 'ffd-flow-demo',
  imports: [FlowComponent],
  templateUrl: './flow-demo.component.html',
  styleUrl: './flow-demo.component.scss',
})
export class FlowDemoComponent {
  public nodes: Node[] = [
    {
      id: '1',
      type: 'default',
      point: { x: 10, y: 10 },
    },
    {
      id: '2',
      type: 'default',
      point: { x: 100, y: 100 },
    },
  ];

  public edges: Edge[] = [
    {
      id: uuid(),
      source: '1',
      target: '2',
      markers: {
        start: {
          type: 'arrow-closed',
        },
        end: {
          type: 'arrow',
        },
      },
    },
  ];

  public styles = { root, container };

  public handleConnect(connection: Connection) {
    this.edges = [
      ...this.edges,
      {
        id: uuid(),
        source: connection.source,
        target: connection.target,
        markers: {
          end: {
            type: 'arrow',
          },
        },
      },
    ];
  }
}

const root: RootStyleSheetFn = () => ({
  width: signal(200),
});

const container: ContainerStyleSheetFn = (snapshot: Signal<UISnapshot>) => ({
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
