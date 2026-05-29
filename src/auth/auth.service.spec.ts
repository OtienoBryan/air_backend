import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Staff } from '../entities/staff.entity';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let staffRepository: any;
  let jwtService: JwtService;

  const mockStaff = {
    id: 1,
    name: 'John Doe',
    business_email: 'john@example.com',
    password: 'hashedPassword123',
    is_active: 1,
    role: 'admin',
    empl_no: 'EMP001',
    id_no: 'ID123456',
    designation: 'Manager',
    phone_number: '1234567890',
    department: 'IT',
    department_id: 1,
    department_email: 'john@it.com',
    salary: 50000,
    employment_type: 'Full-time',
    gender: 'Male' as const,
    created_at: new Date(),
    updated_at: new Date(),
    avatar_url: 'avatar.jpg',
    status: 1
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Staff),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    staffRepository = module.get(getRepositoryToken(Staff));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateStaff', () => {
    it('should return staff when valid credentials are provided', async () => {
      // Arrange
      staffRepository.findOne.mockResolvedValue(mockStaff);
      mockedBcrypt.compare.mockResolvedValue(true);

      // Act
      const result = await service.validateStaff('john@example.com', 'password123');

      // Assert
      expect(result).toEqual(mockStaff);
      expect(staffRepository.findOne).toHaveBeenCalledWith({ where: { business_email: 'john@example.com' } });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
    });

    it('should return null when email is missing', async () => {
      // Act
      const result = await service.validateStaff('', 'password123');

      // Assert
      expect(result).toBeNull();
      expect(staffRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return null when password is missing', async () => {
      // Act
      const result = await service.validateStaff('john@example.com', '');

      // Assert
      expect(result).toBeNull();
      expect(staffRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return null when email format is invalid', async () => {
      // Act
      const result = await service.validateStaff('invalid-email', 'password123');

      // Assert
      expect(result).toBeNull();
      expect(staffRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return null when staff is not found', async () => {
      // Arrange
      staffRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.validateStaff('nonexistent@example.com', 'password123');

      // Assert
      expect(result).toBeNull();
      expect(staffRepository.findOne).toHaveBeenCalledWith({ where: { business_email: 'nonexistent@example.com' } });
    });

    it('should return null when staff is inactive', async () => {
      // Arrange
      const inactiveStaff = { ...mockStaff, is_active: 0 };
      staffRepository.findOne.mockResolvedValue(inactiveStaff);

      // Act
      const result = await service.validateStaff('john@example.com', 'password123');

      // Assert
      expect(result).toBeNull();
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      // Arrange
      staffRepository.findOne.mockResolvedValue(mockStaff);
      mockedBcrypt.compare.mockResolvedValue(false);

      // Act
      const result = await service.validateStaff('john@example.com', 'wrongpassword');

      // Assert
      expect(result).toBeNull();
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword123');
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      staffRepository.findOne.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await service.validateStaff('john@example.com', 'password123');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return auth response when login is successful', async () => {
      // Arrange
      const loginDto = { email: 'john@example.com', password: 'password123' };
      staffRepository.findOne.mockResolvedValue(mockStaff);
      mockedBcrypt.compare.mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: 1,
          name: 'John Doe',
          business_email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'admin'
        }
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ 
        sub: 1, 
        email: 'john@example.com',
        role: 'admin'
      });
    });

    it('should return null when validation fails', async () => {
      // Arrange
      const loginDto = { email: 'john@example.com', password: 'wrongpassword' };
      staffRepository.findOne.mockResolvedValue(mockStaff);
      mockedBcrypt.compare.mockResolvedValue(false);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toBeNull();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register a new staff member successfully', async () => {
      // Arrange
      const registerDto = {
        name: 'Jane Doe',
        business_email: 'jane@example.com',
        password: 'password123',
        role: 'user',
        empl_no: 'EMP002',
        id_no: 'ID789012',
        designation: 'Developer',
        phone_number: '0987654321',
        department: 'IT',
        department_id: 1,
        department_email: 'jane@it.com',
        salary: 45000,
        employment_type: 'Full-time',
        gender: 'Female' as const,
        avatar_url: 'avatar2.jpg'
      };

      const hashedPassword = 'hashedPassword456';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword);
      
      const savedStaff = { ...registerDto, id: 2, password: hashedPassword, is_active: 1, status: 1 };
      staffRepository.save.mockResolvedValue(savedStaff);

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(result).toEqual(savedStaff);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(staffRepository.save).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
        is_active: 1,
        status: 1
      });
    });

    it('should handle registration errors gracefully', async () => {
      // Arrange
      const registerDto = {
        name: 'Jane Doe',
        business_email: 'jane@example.com',
        password: 'password123',
        role: 'user',
        empl_no: 'EMP002',
        id_no: 'ID789012',
        designation: 'Developer',
        phone_number: '0987654321',
        department: 'IT',
        department_id: 1,
        department_email: 'jane@it.com',
        salary: 45000,
        employment_type: 'Full-time',
        gender: 'Female' as const,
        avatar_url: 'avatar2.jpg'
      };

      staffRepository.save.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(result).toBeNull();
    });
  });
});
