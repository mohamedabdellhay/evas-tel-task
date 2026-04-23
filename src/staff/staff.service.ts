import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateStaffDto } from './dto/create-staff.dto';

@Injectable()
export class StaffService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateStaffDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const staff = new this.userModel({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
    });

    const saved = await staff.save();
    const { password, ...result } = saved.toObject();
    return result;
  }

  async findAll() {
    return this.userModel
      .find({ role: { $in: ['cashier', 'owner'] } })
      .select('-password')
      .exec();
  }
}
