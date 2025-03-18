import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { BlockStyleSheet } from '../../shared/interfaces/stylesheet.interface';
import { TreeManagerService } from '../../core/services/tree-manager.service';

@Component({
  selector: 'lib-block',
  imports: [],
  templateUrl: './block.component.html',
  styleUrl: './block.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'attr.width': 'hostWidth()',
    'attr.height': 'hostHeight()',
    'attr.x': 'hostX()',
    'attr.y': 'hostY()',
  },
})
export class BlockComponent implements OnInit {
  styleSheet = input.required<BlockStyleSheet>();

  hostWidth = signal(0);
  hostHeight = signal(0);
  hostX = signal(0);
  hostY = signal(0);

  protected width = signal(0);
  protected height = signal(0);
  protected x = signal(0);
  protected y = signal(0);
  protected radiusX = signal(0);
  protected fillColor = signal('');

  protected marginBottom = signal(0);

  private get host() {
    return this.hostRef.nativeElement;
  }

  private hostRef = inject(ElementRef);
  private treeManager = inject(TreeManagerService);

  ngOnInit(): void {
    this.hostWidth.set(this.styleSheet().width);
    this.width.set(this.styleSheet().width);

    this.hostHeight.set(this.styleSheet().height);
    this.height.set(this.styleSheet().height);

    this.hostY.set(this.getElementY());

    this.marginBottom.set(this.styleSheet().marginBottom);

    this.fillColor.set(this.styleSheet().backgroundColor);

    this.radiusX.set(this.styleSheet().borderRadius);

    this.treeManager.register(this.host, this);
  }

  private getElementY() {
    const prevSibling = this.host.previousSibling as Element | null;

    if (this.treeManager.has(prevSibling)) {
      const prevComponent = this.treeManager.get(prevSibling)!;

      return (
        prevComponent.y() +
        prevComponent.height() +
        prevComponent.marginBottom()
      );
    }

    return 0;
  }
}
