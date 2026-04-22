import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule], 
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}
