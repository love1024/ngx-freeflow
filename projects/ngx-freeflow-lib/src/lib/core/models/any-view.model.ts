import { Subscription } from 'rxjs';
import { DocViewComponent } from '../../components/doc-view/doc-view.component';
import { StyleSheet } from '../interfaces/stylesheet.interface';
import { inject, Signal } from '@angular/core';

export abstract class AnyViewModel {
  protected subscription = new Subscription();

  public parent: AnyViewModel | null = null;
  public children: AnyViewModel[] = [];

  public abstract width: Signal<number>;
  public abstract height: Signal<number>;

  public abstract styleSheet: StyleSheet;

  public abstract calculateLayout(): void;

  public component = inject(DocViewComponent);

  public destroy() {
    this.subscription.unsubscribe();
  }
}
