import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'token' }),
    register: jest.fn().mockResolvedValue({ user: { email: 'test@test.com' } }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      const loginDto = { email: 'test@test.com', password: 'password' };
      const result = await controller.login(loginDto);
      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('register', () => {
    it('should call authService.register', async () => {
      const registerDto = {
        email: 'test@test.com',
        password: 'password',
        fullName: 'Test User',
        role: 'admin' as any,
      };
      const result = await controller.register(registerDto);
      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({ user: { email: 'test@test.com' } });
    });
  });
});
