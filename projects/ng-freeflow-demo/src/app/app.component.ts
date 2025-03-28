import { Component } from '@angular/core';
import {
  ContainerComponent,
  HtmlBlockComponent,
  ImageViewComponent,
  RootComponent,
} from 'ng-freeflow-lib';
import { styles } from './app.styles';
import { ButtonComponent } from './components/button/button.component';

@Component({
  selector: 'ffd-root',
  imports: [
    ContainerComponent,
    RootComponent,
    HtmlBlockComponent,
    ImageViewComponent,
    ButtonComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  svgStyles = styles;
}
