import { Component } from '@angular/core';
import { BlockComponent } from 'ng-freeflow-lib';
import { styles } from './app.styles';

@Component({
  selector: 'app-root',
  imports: [BlockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  svgStyles = styles;
}
