import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
  isEqualObjects(object1: Record<string, string>, object2: Record<string, string>): boolean {
    const keysObject1 = Object.keys(object1);
    const keysObject2 = Object.keys(object2);

    for (let i = 0; i < keysObject1.length; i++) {
      if (object1[keysObject1[i]] !== object2[keysObject2[i]]) return false;
    }
    return true;
  }
}
