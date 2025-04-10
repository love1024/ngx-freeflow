import { Injectable } from '@angular/core';
import { DocViewComponent } from '../../components/doc-view/doc-view.component';
import { AnyViewModel } from '../models/any-view.model';
import { RootViewModel } from '../../components/root/root-view.model';

@Injectable()
export class DocTreeBuilderService {
  public root: RootViewModel | null = null;
  private componentMap = new Map<DocViewComponent, AnyViewModel>();

  register(model: AnyViewModel) {
    this.componentMap.set(model.component, model);

    if (model instanceof RootViewModel) {
      this.root = model;
    }
  }

  getByComponent(component: DocViewComponent): AnyViewModel {
    return this.componentMap.get(component)!;
  }

  calculateLayout(): void {
    this.root?.calculateLayout();
  }
}
