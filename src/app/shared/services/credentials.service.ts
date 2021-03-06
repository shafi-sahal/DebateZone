import { Injectable } from '@angular/core';

@Injectable()

export class CredentialsService {
  private visible = false;

  toggleVisibility(): void {
    this.visible = !this.visible;
  }

  getVisibilityIcon(): string {
    return this.visible ? 'visibility' : 'visibility_off';
  }

  getInputType(): string {
    return this.visible ? 'text' : 'password';
  }
}
