import { Component } from '@angular/core';
import {
  ContainerComponent,
  HtmlBlockComponent,
  DocComponent,
  provideComponent,
} from 'ng-freeflow-lib';
import { styles } from './button.styles';

@Component({
  selector: '[ff-button]',
  imports: [ContainerComponent, HtmlBlockComponent],
  template: `
    <svg ff-container [styleSheet]="styles.button">
      <foreignObject ff-html>
        <div
          style="height: 40px; display: flex; justify-content: center; align-items: center;;">
          Add New
        </div>
      </foreignObject>
    </svg>
  `,
  providers: [provideComponent(ButtonComponent)],
})
export class ButtonComponent extends DocComponent {
  protected styles = styles;
}
