import { Injectable, signal } from '@angular/core';
import { NodeModel } from '../models/node.model';

export interface FlowStatusIdle {
  state: 'idle';
  payload: null;
}

export interface FlowStatusConnectionStart {
  state: 'connection-start';
  payload: {
    sourceNode: NodeModel;
  };
}

export interface FlowStatusConnectionValidation {
  state: 'connection-validation';
  payload: {
    sourceNode: NodeModel;
    targetNode: NodeModel;
    valid: boolean;
  };
}

export interface FlowStatusConnectionEnd {
  state: 'connection-end';
  payload: {
    sourceNode: NodeModel;
    targetNode: NodeModel;
  };
}

export type FlowStatus =
  | FlowStatusIdle
  | FlowStatusConnectionStart
  | FlowStatusConnectionValidation
  | FlowStatusConnectionEnd;

@Injectable()
export class FlowStatusService {
  constructor() {
    console.log('FlowStatusService initialized');
  }
  public readonly status = signal<FlowStatus>({
    state: 'idle',
    payload: null,
  });

  public setIdleStatus() {
    this.status.set({
      state: 'idle',
      payload: null,
    });
  }

  public setConnectionStartStatus(sourceNode: NodeModel) {
    this.status.set({
      state: 'connection-start',
      payload: {
        sourceNode,
      },
    });
  }

  public setConnectionValidationStatus(
    sourceNode: NodeModel,
    targetNode: NodeModel,
    valid: boolean
  ) {
    this.status.set({
      state: 'connection-validation',
      payload: {
        sourceNode,
        targetNode,
        valid,
      },
    });
  }

  public setConnectionEndStatus(sourceNode: NodeModel, targetNode: NodeModel) {
    this.status.set({
      state: 'connection-end',
      payload: {
        sourceNode,
        targetNode,
      },
    });
  }
}

export function batchStatusChanges(...changes: (() => void)[]) {
  if (changes.length) {
    const [firstChange, ...restChanges] = changes;
    firstChange();
    restChanges.forEach(change => setTimeout(() => change()));
  }
}
