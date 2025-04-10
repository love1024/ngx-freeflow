import { NgDocPage } from '@ng-doc/core';
import ExamplesCategory from '../../ng-doc.category';
import { FlowDemoComponent } from './demo/flow-demo/flow-demo.component';

const TestPage: NgDocPage = {
  title: `Nodes`,
  mdFile: './index.md',
  category: ExamplesCategory,
  demos: { FlowDemoComponent },
};

export default TestPage;
