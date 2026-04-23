import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    private readonly usersService: UsersService,
    private readonly restaurantsService: RestaurantsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    await this.checkIfUserExist(createReservationDto.userId);
    await this.checkIfRestaurantExist(createReservationDto.restaurantId);
    const createdReservation = new this.reservationModel(createReservationDto);
    const savedReservation = await createdReservation.save();

    // Invalidate the cache for the specific restaurant's availability
    const cacheKey = `restaurant:${createReservationDto.restaurantId}:availability`;
    await this.cacheManager.del(cacheKey);

    return savedReservation;
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationModel
      .find()
      .populate('restaurantId')
      .populate('userId', ['-_id', '-__v', '-fullName', '-password'])
      .exec();
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel
      .findById(id)
      .populate('restaurantId')
      .populate('userId')
      .exec();
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const updatedReservation = await this.reservationModel
      .findByIdAndUpdate(id, updateReservationDto, { new: true })
      .exec();
    if (!updatedReservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return updatedReservation;
  }

  async remove(id: string): Promise<Reservation> {
    const deletedReservation = await this.reservationModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedReservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return deletedReservation;
  }

  async checkIfUserExist(id: string) {
    const user = await this.usersService.userExist(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async checkIfRestaurantExist(id: string) {
    const restaurant = await this.restaurantsService.restaurantExist(id);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return restaurant;
  }
}
