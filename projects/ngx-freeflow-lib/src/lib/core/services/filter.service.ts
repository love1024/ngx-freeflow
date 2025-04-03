import { computed, Injectable, signal } from '@angular/core';
import { Shadow } from '../interfaces/filter.interface';
import { hashCode } from '../utils/hash';

@Injectable({ providedIn: 'root' })
export class FilterService {
  public readonly shadows = signal(new Map<number, Shadow>());

  addShadow(shadow: Shadow) {
    this.shadows.update(shadows => {
      const newMap = new Map<number, Shadow>(shadows);
      newMap.set(this.shadowHash(shadow), shadow);

      return newMap;
    });
  }

  deleteShadow(shadow: Shadow) {
    this.shadows.update(shadows => {
      const newMap = new Map<number, Shadow>(shadows);
      newMap.set(this.shadowHash(shadow), shadow);
      newMap.delete(this.shadowHash(shadow));
      return newMap;
    });
  }

  getShadowId(shadow: Shadow) {
    return computed(() => {
      const hash = this.shadowHash(shadow);

      return this.shadows().has(hash) ? hash : null;
    });
  }

  private shadowHash(shadow: Shadow) {
    return hashCode(JSON.stringify(shadow));
  }
}
