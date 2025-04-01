import { Component } from '@angular/core';
import { ContainerComponent, RootComponent } from 'ng-freeflow-lib';
import { styles } from './app.styles';
import { FormComponent } from './components/form/form.component';

@Component({
  selector: 'ffd-root',
  imports: [ContainerComponent, RootComponent, FormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  svgStyles = styles;
}
