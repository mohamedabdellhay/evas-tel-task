import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getModelToken } from '@nestjs/mongoose';
import { Reservation } from './schemas/reservation.schema';
import { UsersService } from '../users/users.service';
import { RestaurantsService } from '../restaurants/restaurants.service';

describe('ReservationsService', () => {
  let service: ReservationsService;

  function mockReservationModel(dto: any) {
    this.data = dto;
    this.save = jest.fn().mockResolvedValue({ ...dto, _id: 'id' });
  }
  mockReservationModel.find = jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    }),
  });

  const mockUsersService = {
    userExist: jest.fn().mockResolvedValue(true),
  };

  const mockRestaurantsService = {
    restaurantExist: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getModelToken(Reservation.name),
          useValue: mockReservationModel,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: RestaurantsService,
          useValue: mockRestaurantsService,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a reservation if user and restaurant exist', async () => {
    const dto = {
      userId: 'u1',
      restaurantId: 'r1',
      date: '2023-01-01',
      time: '12:00',
      partySize: 2,
    };
    const result = await service.create(dto);
    expect(result).toBeDefined();
    expect(mockUsersService.userExist).toHaveBeenCalledWith('u1');
    expect(mockRestaurantsService.restaurantExist).toHaveBeenCalledWith('r1');
  });
});
