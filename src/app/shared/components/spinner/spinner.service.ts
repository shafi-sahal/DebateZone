import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { SpinnerComponent } from './spinner.component';

@Injectable({ providedIn: 'root' })
export class Spinner {
  _message = '';
  private overlayRef!: OverlayRef
  constructor(private overlay: Overlay) {
    this.overlayRef = this.overlay.create();
  }

  set message(message: string) { this._message = message; }

  show(): void {
    this.overlayRef.attach(new ComponentPortal(SpinnerComponent));
  }

  hide(): void {
    this.overlayRef.detach();
  }
}
