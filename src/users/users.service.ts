import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(data: Partial<User>) {
    // console.log('data',data);
    return this.userModel.create(data);
  }

  async findAll() {
    return this.userModel.find();
  }

  async userExist(id: string) {
    return this.userModel.exists({ _id: id });
  }
}