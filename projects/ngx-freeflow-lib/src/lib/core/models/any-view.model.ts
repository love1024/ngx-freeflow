import { Subject, Subscription } from 'rxjs';
import { DocViewComponent } from '../../components/doc-view/doc-view.component';
import { StyleSheet } from '../interfaces/stylesheet.interface';

export abstract class AnyViewModel {
  protected subscription = new Subscription();
  private _viewUpdate$ = new Subject<void>();

  public viewUpdate = this._viewUpdate$.asObservable();

  public parent: AnyViewModel | null = null;
  public children: AnyViewModel[] = [];

  public abstract width: number;
  public abstract height: number;

  public abstract component: DocViewComponent;
  public abstract styleSheet: StyleSheet;

  public abstract calculateLayout(): void;

  public updateView(): void {
    this._viewUpdate$.next();
  }

  public destroy() {
    this.subscription.unsubscribe();
  }
}
