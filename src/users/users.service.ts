import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => {
      console.log(username + ' ' + user.username);
      return user.username === username;
    });
  }

  async createOne(username: string, encryptedPassword: string) {
    this.users.push({
      userId: this.users.length + 1,
      username,
      password: encryptedPassword,
    });
    return this.findOne(username);
  }
}
