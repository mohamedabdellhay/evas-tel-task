import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateJwtPayload: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if validation succeeds', async () => {
      const mockUser = { _id: 'anyid', email: 'test@test.com' };
      mockAuthService.validateJwtPayload.mockResolvedValue(mockUser);

      const result = await strategy.validate({ sub: 'anyid' });
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if validation fails', async () => {
      mockAuthService.validateJwtPayload.mockResolvedValue(null);

      await expect(strategy.validate({ sub: 'invalid' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
