import { computed, signal } from '@angular/core';
import { ContainerStyleSheet } from '../../../public-api';
import {
  BlockViewModel,
  styleSheetWithDefaults as blockStyleSheetWithDefaults,
} from '../../core/models/block-view.model';

const styleSheetWithDefaults = (
  styles: ContainerStyleSheet
): Required<ContainerStyleSheet> => {
  return {
    ...blockStyleSheetWithDefaults(styles),
    backgroundColor: styles.backgroundColor ?? signal(''),
    borderColor: styles.borderColor ?? signal(''),
    borderWidth: styles.borderWidth ?? signal(0),
    borderRadius: styles.borderRadius ?? signal(0),
    animation: styles.animation ?? {},
  };
};

export class ContainerViewModel extends BlockViewModel {
  // rect height is increased by borderWidth if it applied, so we need decrease
  // it by this value in order to fit into parent element
  public contentHeight = computed(
    () => this.height() - this.styleSheet.borderWidth()
  );

  // rect width is increased by borderWidth if it applied, so we need decrease
  // it back by this value in order to fit into parent element
  public contentWidth = computed(
    () => this.width() - this.styleSheet.borderWidth()
  );

  // TODO explain this logic, may lead to bugs
  public contentX = computed(() => this.styleSheet.borderWidth() / 2);
  public contentY = computed(() => this.styleSheet.borderWidth() / 2);

  public borderRadius = computed(() => this.styleSheet.borderRadius());
  public borderWidth = computed(() => this.styleSheet.borderWidth());
  public borderColor = computed(() => this.styleSheet.borderColor());
  public backgroundColor = computed(() => this.styleSheet.backgroundColor());

  public styleSheet: Required<ContainerStyleSheet>;

  constructor(styleSheet: ContainerStyleSheet) {
    super();

    this.styleSheet = styleSheetWithDefaults(styleSheet);
  }
}
