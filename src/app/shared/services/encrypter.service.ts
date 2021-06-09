import { Injectable } from '@angular/core';
import { AES } from 'crypto-js';

@Injectable()
export class Encrypter {
  encrypt(text: string): string {
    const secretKey = '54ijj;[[]"Asd[lf4487/d54dg242?>:">78hd75w';
    return AES.encrypt(text, secretKey).toString();
  }
}
