import { Component } from '@angular/core';
import {
  ContainerComponent,
  HtmlBlockComponent,
  ImageViewComponent,
  RootComponent,
} from 'ng-freeflow-lib';
import { styles } from './app.styles';

@Component({
  selector: 'ffd-root',
  imports: [
    ContainerComponent,
    RootComponent,
    HtmlBlockComponent,
    ImageViewComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  svgStyles = styles;
}
