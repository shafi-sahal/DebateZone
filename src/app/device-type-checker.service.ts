import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DeviceTypeChecker {
  isMobile = new BehaviorSubject<boolean>(true);
}
