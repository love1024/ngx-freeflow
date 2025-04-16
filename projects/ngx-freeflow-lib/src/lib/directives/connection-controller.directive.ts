import { Directive, effect, inject, output } from '@angular/core';
import { Connection } from '../core/interfaces/connection.interface';
import { FlowStatusService } from '../core/services/flow-status.service';
import { FlowEntitiesService } from '../core/services/flow-entities.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[connectionController]',
})
export class ConnectionControllerDirective {
  public connectionMade = output<Connection>();

  private statusService = inject(FlowStatusService);
  private flowEntitiesService = inject(FlowEntitiesService);

  protected connectEffect = effect(() => {
    const status = this.statusService.status();

    if (status.state === 'connection-end') {
      const sourceModel = status.payload.sourceNode;
      const targetModel = status.payload.targetNode;

      const source = sourceModel.node.id;
      const target = targetModel.node.id;

      const connection = this.flowEntitiesService.connection();

      if (connection.validator({ source, target })) {
        this.connectionMade.emit({ source, target });
      }
    }
  });
}
