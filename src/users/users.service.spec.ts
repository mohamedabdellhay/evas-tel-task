import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserModel = {
    create: jest.fn(),
    find: jest.fn(),
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const userData = { email: 'test@example.com', fullName: 'Test User' };
    mockUserModel.create.mockResolvedValue(userData);
    expect(await service.create(userData)).toEqual(userData);
  });

  it('should find all users', async () => {
    mockUserModel.find.mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });

  it('should check if user exists', async () => {
    mockUserModel.exists.mockResolvedValue(true);
    expect(await service.userExist('id')).toBe(true);
  });
});
