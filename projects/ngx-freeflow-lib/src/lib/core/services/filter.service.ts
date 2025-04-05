import { Injectable, signal } from '@angular/core';
import { Shadow } from '../interfaces/filter.interface';
import { hashCode } from '../utils/hash';

@Injectable({ providedIn: 'root' })
export class FilterService {
  public readonly shadows = signal(new Map<number, Shadow>());

  private refs = new Map<number, number>();

  addShadow(shadow: Shadow) {
    this.shadows.update(shadows => {
      const hash = this.shadowHash(shadow);

      this.refs.set(hash, (this.refs.get(hash) ?? 0) + 1);

      return shadows.set(hash, shadow);
    });
  }

  deleteShadow(shadow: Shadow) {
    this.shadows.update(shadows => {
      const hash = this.shadowHash(shadow);

      // decrease ref count for this shadow
      this.refs.set(hash, (this.refs.get(hash) ?? 0) - 1);

      // if there are no refs, delete this shadow
      if (this.refs.get(hash)! <= 0) {
        shadows.delete(hash);
      }

      return shadows;
    });
  }

  getShadowId(shadow: Shadow) {
    const hash = this.shadowHash(shadow);
    return this.shadows().has(hash) ? hash : null;
  }

  private shadowHash(shadow: Shadow) {
    return hashCode(JSON.stringify(shadow));
  }
}
