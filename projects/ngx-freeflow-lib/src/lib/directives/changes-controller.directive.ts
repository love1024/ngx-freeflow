import { Directive, inject, output } from '@angular/core';
import { NodeChangesService } from '../core/services/node-changes.service';
import { EdgeChangeService } from '../core/services/edge-changes.service';
import { EdgeChange, NodeChange } from '../../public-api';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[changesController]' })
export class ChangesControllerDirective {
  protected nodesChangeService = inject(NodeChangesService);
  protected edgesChangeService = inject(EdgeChangeService);

  public nodeChanges = output<NodeChange[]>();

  public edgeChanges = output<EdgeChange[]>();

  protected nodesChangeProxySubscription = this.nodesChangeService.changes$
    .pipe(
      tap(changes => this.nodeChanges.emit(changes)),
      takeUntilDestroyed()
    )
    .subscribe();

  protected edgesChangeProxySubscription = this.edgesChangeService.changes$
    .pipe(
      tap(changes => this.edgeChanges.emit(changes)),
      takeUntilDestroyed()
    )
    .subscribe();
}
