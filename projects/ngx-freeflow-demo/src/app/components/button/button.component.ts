import { Component, input } from '@angular/core';
import {
  ContainerComponent,
  HtmlBlockComponent,
  DocComponent,
  provideComponent,
} from 'ngx-freeflow-lib';
import { styles } from './button.styles';

@Component({
  selector: '[ff-button]',
  imports: [ContainerComponent, HtmlBlockComponent],
  template: `
    <svg ff-container [styleSheet]="styles.button">
      <foreignObject ff-html>
        <div class="button-content">{{ text() }}</div>
      </foreignObject>
    </svg>
  `,
  styles: [
    `
      .button-content {
        height: 30px;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font:
          0.8rem 'Fira Sans',
          sans-serif;
      }
    `,
  ],
  providers: [provideComponent(ButtonComponent)],
})
export class ButtonComponent extends DocComponent {
  text = input<string>('');

  protected styles = styles;
}
