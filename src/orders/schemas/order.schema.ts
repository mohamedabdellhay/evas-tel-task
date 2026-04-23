import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'MenuItem', required: true })
  menuItemId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  price: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  waiterId: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ required: true, min: 0 })
  totalAmount: number;
  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    required: true,
  })
  status: OrderStatus;

  @Prop({ default: false })
  isArchived: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index(
  { createdAt: 1, waiterId: 1 },
  {
    name: 'idx_analytics_date_waiter',
    partialFilterExpression: { status: OrderStatus.COMPLETED },
  },
);

OrderSchema.index(
  { waiterId: 1, createdAt: -1 },
  { name: 'idx_waiter_history' },
);
