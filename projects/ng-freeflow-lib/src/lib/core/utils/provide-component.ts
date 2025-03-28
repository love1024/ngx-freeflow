import { forwardRef, Type } from '@angular/core';
import { DocViewComponent } from '../../components/doc-view/doc-view.component';

export const provideComponent = (ctor: Type<unknown>) => {
  return { provide: DocViewComponent, useExisting: forwardRef(() => ctor) };
};
