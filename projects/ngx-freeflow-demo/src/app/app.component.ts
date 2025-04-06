import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { styles } from './app.styles';
import {
  NgDocNavbarComponent,
  NgDocRootComponent,
  NgDocSidebarComponent,
} from '@ng-doc/app';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { routingAnimation } from './animations/routing.animation';

@Component({
  selector: 'ffd-root',
  imports: [
    RouterOutlet,
    NgDocRootComponent,
    NgDocNavbarComponent,
    NgDocSidebarComponent,
  ],
  animations: [routingAnimation()],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  svgStyles = styles;
  private contexts = inject(ChildrenOutletContexts);

  get routingAnimations() {
    return this.contexts.getContext('primary')?.route?.snapshot?.title;
  }
}
