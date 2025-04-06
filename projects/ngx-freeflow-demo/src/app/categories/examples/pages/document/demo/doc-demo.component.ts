import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  signal,
} from '@angular/core';
import {
  ContainerComponent,
  ContainerStyleSheet,
  HtmlBlockComponent,
  RootComponent,
  RootStyleSheet,
  UISnapshot,
  hasClasses,
} from 'ngx-freeflow-lib';

@Component({
  templateUrl: './doc-demo.component.html',
  styleUrls: ['./doc-demo.styles.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RootComponent, ContainerComponent, HtmlBlockComponent],
})
export class DocDemoComponent {
  protected styles = styles;
}

const styles = {
  root: () =>
    ({
      width: signal(200),
    }) satisfies RootStyleSheet,

  container: (snapshot: Signal<UISnapshot>) =>
    ({
      width: signal(180),
      borderRadius: signal(5),
      backgroundColor: signal('rgb(30 30 30)'),
      marginBottom: signal(10),
      boxShadow: computed(() => {
        if (hasClasses(snapshot(), ':hover')) {
          return {
            hOffset: 3,
            vOffset: 5,
            blur: 3,
            color: 'rgb(255 0 0 / 0.4)',
          };
        }

        return null;
      }),
    }) satisfies ContainerStyleSheet,
};
