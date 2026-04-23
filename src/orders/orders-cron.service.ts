import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrdersCronService {
  private readonly logger = new Logger(OrdersCronService.name);

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async archiveOldOrders() {
    this.logger.log('Running daily cron job to flag/archive legacy data...');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const result = await this.orderModel.updateMany(
        {
          createdAt: { $lt: thirtyDaysAgo },
          isArchived: false,
        },
        {
          $set: { isArchived: true },
        },
      );
      this.logger.log(`Archived ${result.modifiedCount} legacy orders.`);
    } catch (error) {
      this.logger.error('Failed to archive legacy orders', error);
    }
  }
}
