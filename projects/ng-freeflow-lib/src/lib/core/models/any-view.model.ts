import { DocViewComponent } from '../../components/doc-view/doc-view.component';

export abstract class AnyViewModel {
  public parent: AnyViewModel | null = null;
  public children: AnyViewModel[] = [];

  public abstract component: DocViewComponent;

  public abstract calculateLayout(): void;
}
