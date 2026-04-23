import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  @ApiProperty({ description: 'The ID of the restaurant' })
  restaurantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty({ description: 'The ID of the user' })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  @ApiProperty({
    description: 'The date of the reservation in YYYY-MM-DD format',
  })
  date: string; // YYYY-MM-DD format

  @Prop({ type: String, required: true })
  @ApiProperty({ description: 'The time of the reservation in HH:MM format' })
  time: string; // HH:MM format

  @Prop({ type: Number, required: true })
  @ApiProperty({ description: 'The size of the party' })
  partySize: number;

  @Prop({ type: String, default: 'PENDING' })
  @ApiProperty({ description: 'The status of the reservation' })
  status: string;

  @Prop({ type: String })
  @ApiProperty({ description: 'The special requests of the reservation' })
  specialRequests?: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
