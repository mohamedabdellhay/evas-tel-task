import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockContext: Partial<ExecutionContext>;

    beforeEach(() => {
      mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: { role: 'admin' },
          }),
        }),
      };
    });

    it('should return true if no roles are required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
      expect(guard.canActivate(mockContext as ExecutionContext)).toBe(true);
    });

    it('should return true if user has required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      expect(guard.canActivate(mockContext as ExecutionContext)).toBe(true);
    });

    it('should throw ForbiddenException if user does not have required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['superadmin']);
      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if no user in request', () => {
      mockContext.switchToHttp = jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
      expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow(
        ForbiddenException,
      );
    });
  });
});
