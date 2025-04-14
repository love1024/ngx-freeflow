import { computed, signal, WritableSignal } from '@angular/core';
import { HandlePositions } from '../interfaces/handle-positions.interface';

export class FlowModel {
  public handlePositions: WritableSignal<HandlePositions> = signal({
    source: 'right',
    target: 'left',
  });

  public view: WritableSignal<[number, number] | 'auto'> = signal([400, 400]);

  public flowWidth = computed(() =>
    this.view() === 'auto' ? '100%' : this.view()[0]
  );

  public flowHeight = computed(() =>
    this.view() === 'auto' ? '100%' : this.view()[1]
  );
}
