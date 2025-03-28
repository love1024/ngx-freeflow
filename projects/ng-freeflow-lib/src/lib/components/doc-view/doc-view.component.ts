import { Directive, inject, Signal } from '@angular/core';
import { AnyViewModel } from '../../core/models/any-view.model';
import { DocTreeBuilderService } from '../../core/services/doc-tree-builder.service';

@Directive()
export abstract class DocViewComponent {
  protected abstract model: Signal<AnyViewModel>;

  protected abstract modelFactory(): AnyViewModel;

  protected treeManager = inject(DocTreeBuilderService);

  protected parent: DocViewComponent | null = inject(DocViewComponent, {
    optional: true,
    skipSelf: true,
  });

  protected createModel<T extends AnyViewModel>(): T {
    const model = this.modelFactory() as T;

    const parent = this.treeManager.getByComponent(this.parent!);
    if (parent) {
      model.parent = parent;
      parent.children.push(model);
    }

    this.treeManager.register(model);

    return model;
  }
}
