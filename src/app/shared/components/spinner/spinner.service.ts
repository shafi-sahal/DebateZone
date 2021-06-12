import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { SpinnerComponent } from './spinner.component';

@Injectable({ providedIn: 'root' })
export class Spinner {
  private _message = '';
  private overlayRef!: OverlayRef
  constructor(private overlay: Overlay) {
    this.overlayRef = this.overlay.create();
  }

  get message(): string { return this._message; }

  show(message = ''): void {
    this._message = message;
    this.overlayRef.attach(new ComponentPortal(SpinnerComponent));
  }

  hide(): void {
    this.overlayRef.detach();
  }
}
