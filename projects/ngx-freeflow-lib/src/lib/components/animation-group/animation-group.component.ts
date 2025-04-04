import {
  ChangeDetectionStrategy,
  Component,
  input,
  viewChildren,
} from '@angular/core';
import { Animation } from '../../core/interfaces/animation.interface';
import { AnimationComponent } from '../animation/animation.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'g[animationGroup]',
  imports: [AnimationComponent],
  template: `
    @for (animation of animationGroup(); track animation) {
      <svg:g [id]="id()" [animation]="animation"></svg:g>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimationGroupComponent {
  animationGroup = input.required<Animation[], Animation | Animation[]>({
    transform: animation =>
      Array.isArray(animation) ? animation : [animation],
  });

  id = input.required<string>();

  protected animationComponents = viewChildren(AnimationComponent);

  public begin(
    options: { reverseOnceComplete: boolean } = { reverseOnceComplete: false }
  ) {
    this.animationComponents().forEach(a => a.begin(options));
  }

  public reverse() {
    this.animationComponents().forEach(a => a.reverse());
  }
}
