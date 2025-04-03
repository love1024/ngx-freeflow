import { Directive, inject, OnInit, signal, Signal } from '@angular/core';
import { AnyViewModel } from '../../core/models/any-view.model';
import { DocTreeBuilderService } from '../../core/services/doc-tree-builder.service';

@Directive()
export abstract class DocViewComponent<T extends AnyViewModel = AnyViewModel>
  implements OnInit
{
  protected model!: Signal<T>;

  protected abstract modelFactory(): T;

  protected treeManager = inject(DocTreeBuilderService);

  protected parent: DocViewComponent | null = inject(DocViewComponent, {
    optional: true,
    skipSelf: true,
  });

  ngOnInit(): void {
    this.model = signal(this.createModel());
  }

  protected createModel(): T {
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
