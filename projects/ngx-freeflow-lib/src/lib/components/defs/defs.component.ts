import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Marker } from '../../core/interfaces/marker.interface';
import { KeyValuePipe } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'defs[flowDefs]',
  imports: [KeyValuePipe],
  templateUrl: './defs.component.html',
  styleUrl: './defs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefsComponent {
  markers = input.required<Map<number, Marker>>();

  protected readonly defaultColor = 'rgb(177, 177, 183)';
}
