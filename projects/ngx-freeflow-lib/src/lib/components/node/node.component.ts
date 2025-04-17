import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NodeModel } from '../../core/models/node.model';
import { DraggableService } from '../../core/services/draggable.service';

import {
  batchStatusChanges,
  FlowStatusService,
} from '../../core/services/flow-status.service';
import { FlowEntitiesService } from '../../core/services/flow-entities.service';

export type HandleState = 'valid' | 'invalid' | 'idle';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'g[node]',
  imports: [NgTemplateOutlet],
  templateUrl: './node.component.html',
  providers: [FlowStatusService, FlowEntitiesService],
})
export class NodeComponent implements OnInit, OnDestroy, AfterViewInit {
  nodeModel = input.required<NodeModel>();
  nodeTemplate = input<TemplateRef<unknown>>();
  handleTemplate = input<TemplateRef<unknown>>();

  nodeContentRef = viewChild<ElementRef<SVGGraphicsElement>>('nodeContent');
  htmlWrapperRef = viewChild<ElementRef<HTMLDivElement>>('htmlWrapper');
  sourceHandleRef =
    viewChild<ElementRef<SVGGElement | SVGCircleElement>>('sourceHandle');
  targetHandleRef =
    viewChild<ElementRef<SVGGElement | SVGCircleElement>>('targetHandle');

  protected showMagnet = computed(
    () =>
      this.flowStatusService.status().state === 'connection-start' ||
      this.flowStatusService.status().state === 'connection-validation'
  );

  private sourceHanldeState = signal<HandleState>('idle');
  private targetHandleState = signal<HandleState>('idle');

  private sourceHanldeStateReadonly = this.sourceHanldeState.asReadonly();
  private targetHanldeStateReadonly = this.targetHandleState.asReadonly();

  private draggableService = inject(DraggableService);
  private hostRef = inject<ElementRef<SVGElement>>(ElementRef);
  private flowStatusService = inject(FlowStatusService);
  private flowEntitiesService = inject(FlowEntitiesService);

  ngOnInit() {
    this.draggableService.makeDraggable(
      this.hostRef.nativeElement,
      this.nodeModel()
    );
  }

  public ngAfterViewInit(): void {
    // TODO remove microtask
    queueMicrotask(() => {
      if (this.nodeModel().node.type === 'default') {
        const { width, height } =
          this.nodeContentRef()!.nativeElement.getBBox();
        this.nodeModel().size.set({ width, height });
      }

      if (this.nodeModel().node.type === 'html-template') {
        const width = this.htmlWrapperRef()!.nativeElement.clientWidth;
        const height = this.htmlWrapperRef()!.nativeElement.clientHeight;

        this.nodeModel().size.set({ width, height });
      }

      const sourceBox = this.sourceHandleRef()!.nativeElement.getBBox({
        stroke: true,
      });
      this.nodeModel().sourceHandleSize.set({
        width: sourceBox.width,
        height: sourceBox.height,
      });

      const targetBox = this.targetHandleRef()!.nativeElement.getBBox({
        stroke: true,
      });
      this.nodeModel().targetHandleSize.set({
        width: targetBox.width,
        height: targetBox.height,
      });
    });
  }

  ngOnDestroy() {
    this.draggableService.destroy(this.hostRef.nativeElement);
  }

  protected startConnection(event: MouseEvent) {
    // ignore drag by stopping propagation
    event.stopPropagation();

    this.flowStatusService.setConnectionStartStatus(this.nodeModel());
  }

  protected endConnection() {
    const status = this.flowStatusService.status();

    if (status.state === 'connection-validation') {
      const sourceNode = status.payload.sourceNode;
      const targetNode = this.nodeModel();

      batchStatusChanges(
        // call to create connection
        () =>
          this.flowStatusService.setConnectionEndStatus(sourceNode, targetNode),
        // when connection created, we need go back to idle status
        () => this.flowStatusService.setIdleStatus()
      );
    }
  }

  protected resetValidateTargetHandle() {
    this.targetHandleState.set('idle');

    // drop back to start status
    const status = this.flowStatusService.status();
    if (status.state === 'connection-validation') {
      this.flowStatusService.setConnectionStartStatus(
        status.payload.sourceNode
      );
    }
  }

  protected validateTargetHandle() {
    const status = this.flowStatusService.status();

    if (status.state === 'connection-start') {
      const sourceNode = status.payload.sourceNode;
      const targetNode = this.nodeModel();

      const source = sourceNode.node.id;
      const target = targetNode.node.id;

      const valid = this.flowEntitiesService
        .connection()
        .validator({ source, target });
      this.targetHandleState.set(valid ? 'valid' : 'invalid');

      this.flowStatusService.setConnectionValidationStatus(
        sourceNode,
        targetNode,
        valid
      );
    }
  }

  protected getHandleContext(type: 'source' | 'target') {
    if (type === 'source') {
      return {
        $implicit: {
          point: this.nodeModel().sourceOffset,
          alignedPoint: this.nodeModel().sourceOffsetAligned,
          state: this.sourceHanldeStateReadonly,
        },
      };
    }

    return {
      $implicit: {
        point: this.nodeModel().targetOffset,
        alignedPoint: this.nodeModel().targetOffsetAligned,
        state: this.targetHanldeStateReadonly,
      },
    };
  }
}
