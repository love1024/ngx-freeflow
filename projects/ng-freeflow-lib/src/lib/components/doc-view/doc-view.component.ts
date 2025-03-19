import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ff-doc-view',
  imports: [],
  templateUrl: './doc-view.component.html',
  styleUrl: './doc-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocViewComponent {}
