import { Directive, inject } from '@angular/core';
import { FlowStatusService } from '../core/services/flow-status.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'svg[rootSvgContext]',
  host: {
    '(document:mouseup)': 'resetConnection()',
  },
})
export class RootSvgContextDirective {
  private flowStatusService = inject(FlowStatusService);

  protected resetConnection() {
    const status = this.flowStatusService.status();
    if (status.state === 'connection-start') {
      this.flowStatusService.setIdelStatus();
    }
  }
}
