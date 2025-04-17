import { NgDocPage } from '@ng-doc/core';
import ExamplesCategory from '../../ng-doc.category';
import { FlowEdgesDemoComponent } from './demo/flow-edges-demo.component';

const TestPage: NgDocPage = {
  title: `Edges`,
  mdFile: './index.md',
  category: ExamplesCategory,
  demos: { FlowEdgesDemoComponent },
};

export default TestPage;
