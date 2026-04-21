import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: "Mohamed",
      age: 26,
    };
  }
}
