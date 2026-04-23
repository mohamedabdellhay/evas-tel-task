import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'Mohamed abdellhay',
      age: 26,
    };
  }
}
