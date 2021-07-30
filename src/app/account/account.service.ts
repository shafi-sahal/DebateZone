import { Injectable } from '@angular/core';
import { User } from '../shared/models/user.model';

@Injectable()
export class AccountService {
  user: User = { name: '', username: '', email: '', mobile: '' };
}
