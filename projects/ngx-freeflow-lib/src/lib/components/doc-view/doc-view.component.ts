import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  inject,
  Injector,
  input,
  OnInit,
  runInInjectionContext,
  signal,
  Signal,
} from '@angular/core';
import { AnyViewModel } from '../../core/models/any-view.model';
import { DocTreeBuilderService } from '../../core/services/doc-tree-builder.service';
import { UISnapshot } from '../../../public-api';
import { Subscription } from 'rxjs';
import { StyleSheet } from '../../core/interfaces/stylesheet.interface';

@Directive()
export abstract class DocViewComponent<
  T extends AnyViewModel = AnyViewModel,
  U extends StyleSheet = StyleSheet,
> implements OnInit
{
  styleSheetFunction = input<(snapshot: Signal<UISnapshot>) => U>(
    undefined,
    // eslint-disable-next-line @angular-eslint/no-input-rename
    { alias: 'styleSheet' }
  );

  protected model!: T;
  protected styleSheet!: U;
  protected uiSnapshot = signal<UISnapshot>({ classes: new Set() });

  protected subscription = new Subscription();

  protected abstract modelFactory(): T;

  protected treeManager = inject(DocTreeBuilderService);
  protected destroyRef = inject(DestroyRef);
  protected cd = inject(ChangeDetectorRef);
  protected injector = inject(Injector);

  protected abstract defaultStyleSheet(): U;

  protected parent: DocViewComponent | null = inject(DocViewComponent, {
    optional: true,
    skipSelf: true,
  });

  ngOnInit(): void {
    const styleSheetFunction = this.styleSheetFunction();
    this.styleSheet = styleSheetFunction
      ? styleSheetFunction(this.uiSnapshot)
      : this.defaultStyleSheet();

    runInInjectionContext(this.injector, () => {
      this.model = this.createModel();
    });

    this.destroyRef.onDestroy(() => this.subscription.unsubscribe());
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
