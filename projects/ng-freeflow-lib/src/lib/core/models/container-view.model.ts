import {
  filter,
  map,
  merge,
  Observable,
  of,
  Subject,
  Subscription,
  tap,
} from 'rxjs';
import { DocViewComponent } from '../../components/doc-view/doc-view.component';
import { ContainerStyleSheet } from '../interfaces/stylesheet.interface';
import { BlockViewModel } from './block-view.model';
import { StylePrioritizer, StylesSource } from '../utils/style-prioritizer';

const styleSheetWithDefaults = (
  styleSheet: ContainerStyleSheet
): Required<ContainerStyleSheet> => {
  return {
    width: 0,
    height: 0,
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    borderColor: '',
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: '',
    onHover: null,
    onFocus: null,
    ...styleSheet,
  };
};

export enum PsuedoEvent {
  hoverIn,
  hoverOut,
  focusIn,
  focusOut,
}

export class ContainerViewModel extends BlockViewModel {
  public contentHeight = 0;
  public contentWidth = 0;
  public contentX = 0;
  public contentY = 0;
  public borderColor = '';
  public backgroundColor = '';

  public styleSheet: Required<ContainerStyleSheet>;

  private pseudoEvent$ = new Subject<PsuedoEvent>();
  private subscription = new Subscription();

  private prioritizer: StylePrioritizer;

  constructor(
    public component: DocViewComponent,
    styleSheet: ContainerStyleSheet
  ) {
    super();

    this.styleSheet = styleSheetWithDefaults(styleSheet);

    this.prioritizer = new StylePrioritizer(this.styleSheet);

    this.borderColor = this.styleSheet.borderColor;
    this.backgroundColor = this.styleSheet.backgroundColor;

    this.subscription.add(this.registerPsuedoEvent().subscribe());
  }

  public triggerPsuedoEvent(evt: PsuedoEvent) {
    this.pseudoEvent$.next(evt);
  }

  public destroy() {
    this.subscription.unsubscribe();
  }

  protected override calculateHeight(): void {
    super.calculateHeight();

    this.contentHeight = this.height - this.styleSheet.borderWidth;
  }

  protected override calculateWidth(): void {
    super.calculateWidth();

    this.contentWidth = this.width - this.styleSheet.borderWidth;
  }

  protected override calculatePosition(): void {
    super.calculatePosition();

    this.contentX = this.styleSheet.borderWidth / 2;
    this.contentY = this.styleSheet.borderWidth / 2;
  }

  private registerPsuedoEvent(): Observable<void> {
    const hoverEvent$ = this.styleSheet.onHover
      ? this.pseudoEvent$.pipe(
          filter(evt =>
            [PsuedoEvent.hoverIn, PsuedoEvent.hoverOut].includes(evt)
          ),
          tap(evt => this.handleHover(evt))
        )
      : of(null);
    const focusEvent$ = this.styleSheet.onFocus
      ? this.pseudoEvent$.pipe(
          filter(evt =>
            [PsuedoEvent.focusIn, PsuedoEvent.focusOut].includes(evt)
          ),
          tap(evt => this.handleFocus(evt))
        )
      : of(null);

    return merge(hoverEvent$, focusEvent$).pipe(map(() => undefined));
  }

  private handleHover(evt: PsuedoEvent) {
    const hover = this.styleSheet.onHover;

    if (!hover) {
      return;
    }

    if (evt === PsuedoEvent.hoverIn) {
      this.borderColor = hover.borderColor ?? this.styleSheet.borderColor;
      this.backgroundColor =
        hover.backgroundColor ?? this.styleSheet.backgroundColor;

      this.prioritizer.set(StylesSource.hover);
    } else {
      const fallbackStyles = this.prioritizer.getFallback(StylesSource.hover);

      this.borderColor = fallbackStyles.borderColor!;
      this.backgroundColor = fallbackStyles.backgroundColor!;

      this.prioritizer.unset(StylesSource.hover);
    }
  }

  private handleFocus(evt: PsuedoEvent) {
    const focus = this.styleSheet.onFocus;

    if (!focus) {
      return;
    }

    if (evt === PsuedoEvent.focusIn) {
      this.borderColor = focus.borderColor ?? this.styleSheet.borderColor;
      this.backgroundColor =
        focus.backgroundColor ?? this.styleSheet.backgroundColor;

      this.prioritizer.set(StylesSource.focus);
    } else {
      const fallbackStyles = this.prioritizer.getFallback(StylesSource.focus);

      this.borderColor = fallbackStyles.borderColor!;
      this.backgroundColor = fallbackStyles.backgroundColor!;

      this.prioritizer.unset(StylesSource.focus);
    }
  }
}
