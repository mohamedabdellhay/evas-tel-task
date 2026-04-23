import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const createdRestaurant = new this.restaurantModel(createRestaurantDto);
    return createdRestaurant.save();
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.find().exec();
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findById(id).exec();
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return restaurant;
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const updatedRestaurant = await this.restaurantModel
      .findByIdAndUpdate(id, updateRestaurantDto, { new: true })
      .exec();
    if (!updatedRestaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return updatedRestaurant;
  }

  async remove(id: string): Promise<Restaurant> {
    const deletedRestaurant = await this.restaurantModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedRestaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return deletedRestaurant;
  }

  async getAvailability(id: string) {
    const cacheKey = `restaurant:${id}:availability`;
    const cached = await this.cacheManager.get<{
      isOpen: boolean;
      availableTables: number;
    }>(cacheKey);
    if (cached) return cached;

    const restaurant = await this.findOne(id);

    // Simulated calculation
    const availability = {
      isOpen: true,
      availableTables: Math.floor(Math.random() * restaurant.capacity),
    };

    // Cache for 60 seconds
    await this.cacheManager.set(cacheKey, availability, 60000);
    return availability;
  }

  async restaurantExist(id: string) {
    return this.restaurantModel.exists({ _id: id });
  }
}
