import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
  isEqualObjects<T>(object1: T, object2: T): boolean {
    const keysObject1 = Object.keys(object1);
    const keysObject2 = Object.keys(object2);

    for (let i = 0; i < keysObject1.length; i++) {
      if (object1[keysObject1[i] as keyof T] !== object2[keysObject2[i] as keyof T]) return false;
    }
    return true;
  }
}
