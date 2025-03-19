import { Component } from '@angular/core';
import { BlockComponent, RootComponent } from 'ng-freeflow-lib';
import { styles } from './app.styles';

@Component({
  selector: 'ffd-root',
  imports: [BlockComponent, RootComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  svgStyles = styles;
}
