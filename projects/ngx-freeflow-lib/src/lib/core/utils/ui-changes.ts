import {
  combineLatest,
  fromEvent,
  map,
  merge,
  Observable,
  shareReplay,
  startWith,
} from 'rxjs';
import { UISnapshot } from '../interfaces/ui-snapshot.interface';

export function uiChanges(target: Element): Observable<UISnapshot> {
  return combineLatest([classChange$(target), hover$(target)]).pipe(
    map(([classSet, hoverSet]) => {
      return {
        classes: new Set([...classSet, ...hoverSet]),
      };
    }),
    shareReplay(1)
  );
}

const classChange$ = (target: Element) =>
  new Observable<Set<string>>(subscriber => {
    const ro = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        const isClass =
          mutation.type === 'attributes' && mutation.attributeName === 'class';

        if (isClass) {
          const classes = new Set(Array.from(target.classList));
          subscriber.next(classes);
        }
      }
    });

    ro.observe(target, { attributes: true });

    return () => ro.disconnect();
  }).pipe(startWith(new Set(Array.from(target.classList))));

const hover$ = (target: Element) =>
  merge(
    fromEvent(target, 'mouseenter').pipe(
      map(() => new Set<string>([':hover']))
    ),
    fromEvent(target, 'mouseleave').pipe(map(() => new Set<string>()))
  ).pipe(startWith(new Set<string>()));
