import { Component } from '@angular/core';
import {
  ContainerComponent,
  HtmlBlockComponent,
  RootComponent,
} from 'ng-freeflow-lib';
import { styles } from './app.styles';

@Component({
  selector: 'ffd-root',
  imports: [ContainerComponent, RootComponent, HtmlBlockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  svgStyles = styles;
}
