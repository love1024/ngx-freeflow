import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import {
  Connection,
  ContainerStyleSheetFn,
  Edge,
  EdgeChange,
  FlowComponent,
  hasClasses,
  Node,
  NodeChange,
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
  public vflow = viewChild<FlowComponent>('flow');

  public nodes: Node[] = [
    {
      id: '1',
      type: 'default',
      point: { x: 10, y: 10 },
      text: '1',
      draggable: false,
    },
    {
      id: '2',
      type: 'default',
      point: { x: 100, y: 100 },
      text: '2',
    },
  ];

  public edges: WritableSignal<Edge[]> = signal([
    {
      id: '1',
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
  ]);

  protected cd = inject(ChangeDetectorRef);

  public styles = { root, container };

  public handleConnect(connection: Connection) {
    this.edges.update(edges => {
      return [
        ...edges,
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
    });
  }

  public addNode() {
    this.nodes = [
      ...this.nodes,
      {
        id: uuid(),
        point: { x: 200, y: 200 },
        type: 'default',
      },
    ];
  }

  public removeNode() {
    this.nodes = this.nodes.filter(n => n.id !== '1');
  }

  public removeEdge() {
    this.edges.update(edges => edges.filter(e => e.id !== '1'));
  }

  public handleEdgesChange(changes: EdgeChange[]) {
    console.log(changes);
  }

  public handleNodesChange(changes: NodeChange[]) {
    console.log(changes);
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
