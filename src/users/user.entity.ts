import { v4 as uuidv4 } from 'uuid';
import { User } from './user.interface';

export class UserEntity implements User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(login: string, password: string) {
    this.id = uuidv4();
    this.login = login;
    this.password = password;
    this.version = 1;
    const now = Date.now();
    this.createdAt = now;
    this.updatedAt = now;
  }
}
