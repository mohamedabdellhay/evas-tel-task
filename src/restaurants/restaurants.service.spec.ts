import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { getModelToken } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('RestaurantsService', () => {
  let service: RestaurantsService;

  function mockRestaurantModel(dto: any) {
    this.data = dto;
    this.save = jest.fn().mockResolvedValue({ ...dto, _id: 'id' });
  }
  mockRestaurantModel.find = jest
    .fn()
    .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });
  mockRestaurantModel.findById = jest
    .fn()
    .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
  mockRestaurantModel.findByIdAndUpdate = jest
    .fn()
    .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
  mockRestaurantModel.findByIdAndDelete = jest
    .fn()
    .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
  mockRestaurantModel.exists = jest.fn().mockResolvedValue(true);

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRestaurantModel,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check if restaurant exists', async () => {
    expect(await service.restaurantExist('id')).toBe(true);
  });
});
