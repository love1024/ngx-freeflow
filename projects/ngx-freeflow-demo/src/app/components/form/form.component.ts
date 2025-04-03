import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DocComponent,
  HtmlBlockComponent,
  provideComponent,
} from 'ngx-freeflow-lib';
import { ButtonComponent } from '../button/button.component';
import { styles } from './form.styles';

@Component({
  selector: '[ff-form]',
  template: `
    <foreignObject ff-html [styleSheet]="styles.header">
      <h3 class="header">Block title</h3>
    </foreignObject>

    <foreignObject ff-html [styleSheet]="styles.controls">
      <div>
        <label for="input" class="label">Input Label</label>
        <input id="input" type="text" class="text-input" />

        <label for="select" class="label">Select Label</label>
        <select id="select" class="select">
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>
      </div>
    </foreignObject>

    <svg:svg ff-button [styleSheet]="styles.button" text="Action"></svg:svg>
  `,
  styles: [
    `
      .header {
        margin: 0;
        color: #ffffff;
        font: 0.8rem 'Fira Sans', sans-serif;
        border-bottom: 1px solid #3c3c3c;
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 5px;
        padding-top: 5px;
      }

      .text-input {
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        background-color: #323232;
        border-radius: 5px;
        border: 1px solid #323232;
        font: 0.8rem 'Fira Sans', sans-serif;
        color: #fff;
      }

      .select {
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        background-color: #323232;
        border-radius: 5px;
        border: 1px solid #323232;
        color: #fff;
      }

      .label {
        color: #adadad;
        font: 0.6rem 'Fira Sans', sans-serif;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HtmlBlockComponent, ButtonComponent],
  providers: [provideComponent(FormComponent)],
})
export class FormComponent extends DocComponent {
  styles = styles;

  constructor() {
    super();
  }
}
