import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let model: any;
  let jwtService: JwtService;

  const mockUser = {
    _id: 'anyid',
    email: 'test@test.com',
    password: 'hashedPassword',
    role: 'USER',
    fullName: 'Test User',
    toObject: jest.fn().mockReturnValue({
      _id: 'anyid',
      email: 'test@test.com',
      role: 'USER',
      fullName: 'Test User',
    }),
  };

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if password matches', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      model.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      model.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(service.validateUser('test@test.com', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      model.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(service.validateUser('none@test.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser as any);
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.login({ email: 'test@test.com', password: 'password' });
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      model.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      model.create.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'test@test.com',
        password: 'password',
        fullName: 'Test User',
        role: 'admin',
      });

      expect(result).toEqual({
        user: {
          _id: 'anyid',
          email: 'test@test.com',
          role: 'USER',
          fullName: 'Test User',
        },
      });
    });

    it('should throw BadRequestException if email exists', async () => {
      model.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'test@test.com',
          password: 'password',
          fullName: 'Test User',
          role: 'admin',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateJwtPayload', () => {
    it('should return user from payload sub', async () => {
      model.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.validateJwtPayload({ sub: 'anyid' });
      expect(result).toEqual(mockUser);
    });
  });
});
