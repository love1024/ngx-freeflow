import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  inject,
  input,
  OnChanges,
  SimpleChanges,
  untracked,
  viewChild,
} from '@angular/core';
import { Node } from '../../core/interfaces/node.interface';
import { NodeComponent } from '../node/node.component';
import { MapContextDirective } from '../../directives/map-context.directive';
import { NodeModel } from '../../core/models/node.model';
import { ZoomService } from '../../core/services/zoom.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { DraggableService } from '../../core/services/draggable.service';
import { RootSvgReferenceDirective } from '../../directives/reference.directive';
import { RootSvgContextDirective } from '../../directives/root-svg-context.directive';
import { ViewportService } from '../../core/services/viewport.service';
import { FlowEntitiesService } from '../../core/services/flow-entities.service';
import { FlowModel } from '../../core/models/flow.model';
import { HandlePositions } from '../../core/interfaces/handle-positions.interface';
import { ConnectionModel } from '../../core/models/connection.model';
import { ConnectionSettings } from '../../core/interfaces/connection-settings.interface';
import { ReferenceKeeper } from '../../core/utils/reference-keeper';
import { Edge } from '../../core/interfaces/edge.interface';
import {
  ConnectionTemplateDirective,
  EdgeLabelHtmlTemplateDirective,
  EdgeTemplateDirective,
  HandleTemplateDirective,
  NodeHtmlTemplateDirective,
} from '../../directives/template.directive';
import { skip } from 'rxjs';
import { ViewportState } from '../../core/interfaces/viewport.interface';
import { Point } from '../../core/interfaces/point.interface';
import { EdgeModel } from '../../core/models/edge.model';
import { addNodesToEdges } from '../../core/utils/add-nodes-to-edges';
import { ConnectionComponent } from '../connection/connection.component';
import { EdgeComponent } from '../edge/edge.component';
import { DefsComponent } from '../defs/defs.component';
import { ConnectionControllerDirective } from '../../directives/connection-controller.directive';
import { SpacePointContextDirective } from '../../directives/space-point-context.directive';

const connectionControllerHostDirective = {
  directive: ConnectionControllerDirective,
  outputs: ['connectionMade'],
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ff-flow',
  imports: [
    MapContextDirective,
    NodeComponent,
    RootSvgReferenceDirective,
    RootSvgContextDirective,
    SpacePointContextDirective,
    ConnectionComponent,
    EdgeComponent,
    DefsComponent,
  ],
  templateUrl: './flow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ZoomService,
    DraggableService,
    FlowEntitiesService,
    ViewportService,
  ],
  hostDirectives: [connectionControllerHostDirective],
})
export class FlowComponent implements OnChanges {
  protected zoomService = inject(ZoomService);

  view = input<[number, number] | 'auto'>([400, 400]);
  minZoom = input(0.5);
  maxZoom = input(3);
  handlePositions = input<HandlePositions>();
  background = input<string>('#ffffff');
  connection = input<ConnectionModel, ConnectionSettings>(undefined, {
    transform: (settings: ConnectionSettings) => new ConnectionModel(settings),
  });
  nodes = input.required<Node[]>();
  edges = input<Edge[]>([]);

  mapContext = viewChild(MapContextDirective);

  nodeHtmlDirective = contentChild(NodeHtmlTemplateDirective);
  edgeTemplateDirective = contentChild(EdgeTemplateDirective);
  edgeLabelHtmlDirective = contentChild(EdgeLabelHtmlTemplateDirective);
  connectionTemplateDirective = contentChild(ConnectionTemplateDirective);
  handleTemplateDirective = contentChild(HandleTemplateDirective);

  get connectionRef() {
    return this.flowEntitiesService.connection;
  }

  get nodeModels() {
    return this.flowEntitiesService.nodes();
  }

  get edgeModels() {
    return this.flowEntitiesService.edges();
  }

  private viewportService = inject(ViewportService);
  private flowEntitiesService = inject(FlowEntitiesService);

  viewport = this.viewportService.readableViewport.asReadonly();
  viewportChanges$ = toObservable(this.viewportService.readableViewport).pipe(
    skip(1)
  );

  protected flowModel = new FlowModel();
  protected markers = this.flowEntitiesService.markers;

  constructor() {
    effect(() => {
      this.flowModel.view.set(this.view());
    });

    effect(() => {
      this.flowModel.handlePositions.set(this.handlePositions()!);
    });

    effect(() => {
      const connection = this.connection();
      if (connection) {
        this.flowEntitiesService.connection.set(connection);
      }
    });

    effect(() => {
      const newNodes = this.nodes();
      const newModels = ReferenceKeeper.nodes(
        newNodes,
        untracked(() => this.flowEntitiesService.nodes())
      );
      this.flowEntitiesService.nodes.set(newModels);
    });

    effect(() => {
      const newEdges = this.edges();
      const newModels = ReferenceKeeper.edges(
        newEdges,
        untracked(() => this.flowEntitiesService.edges())
      );
      this.flowEntitiesService.edges.set(newModels);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nodes']) bindFlowToNodes(this.flowModel, this.nodeModels);
    addNodesToEdges(this.nodeModels, this.edgeModels);
  }

  // #region METHODS_API
  public viewportTo(viewport: ViewportState): void {
    this.viewportService.writableViewport.set({
      changeType: 'absolute',
      state: viewport,
    });
  }

  public zoomTo(zoom: number): void {
    this.viewportService.writableViewport.set({
      changeType: 'absolute',
      state: { zoom },
    });
  }

  public panTo(point: Point): void {
    this.viewportService.writableViewport.set({
      changeType: 'absolute',
      state: point,
    });
  }

  public getNode<T = unknown>(id: string): Node<T> | undefined {
    return this.flowEntitiesService.getNode<T>(id)?.node;
  }
  // #endregion

  protected trackNodes(idx: number, { node }: NodeModel) {
    return node.id;
  }

  protected trackEdges(idx: number, { edge }: EdgeModel) {
    return edge.id;
  }
}

function bindFlowToNodes(flow: FlowModel, nodes: NodeModel[]) {
  nodes.forEach(n => n.setFlow(flow));
}
