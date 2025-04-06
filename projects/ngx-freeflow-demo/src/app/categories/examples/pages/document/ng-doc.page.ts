import { NgDocPage } from '@ng-doc/core';
import { DocDemoComponent } from './demo/doc-demo.component';
import ExamplesCategory from '../../ng-doc.category';

const TestPage: NgDocPage = {
  title: `Document`,
  mdFile: './index.md',
  category: ExamplesCategory,
  demos: { DocDemoComponent },
};

export default TestPage;
