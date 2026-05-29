import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: any;

  const mockProduct = {
    id: 1,
    product_name: 'Test Product',
    product_code: 'TP001',
    brand: 'Test Brand',
    category: 'Electronics',
    subcategory: 'Phones',
    unit_price: 299.99,
    cost_price: 200.00,
    stock_quantity: 100,
    min_stock_level: 10,
    max_stock_level: 500,
    description: 'A test product',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated products with default parameters', async () => {
      // Arrange
      const mockProducts = [mockProduct];
      const mockTotal = 1;
      productRepository.findAndCount.mockResolvedValue([mockProducts, mockTotal]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual({
        products: mockProducts,
        total: mockTotal
      });
      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        where: { is_active: true },
        order: { product_name: 'ASC' },
        skip: 0,
        take: 10
      });
    });

    it('should return paginated products with custom parameters', async () => {
      // Arrange
      const mockProducts = [mockProduct];
      const mockTotal = 25;
      productRepository.findAndCount.mockResolvedValue([mockProducts, mockTotal]);

      // Act
      const result = await service.findAll(2, 5);

      // Assert
      expect(result).toEqual({
        products: mockProducts,
        total: mockTotal
      });
      expect(productRepository.findAndCount).toHaveBeenCalledWith({
        where: { is_active: true },
        order: { product_name: 'ASC' },
        skip: 5,
        take: 5
      });
    });

    it('should handle empty results', async () => {
      // Arrange
      productRepository.findAndCount.mockResolvedValue([[], 0]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual({
        products: [],
        total: 0
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      productRepository.findAndCount.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      // Arrange
      productRepository.findOne.mockResolvedValue(mockProduct);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(result).toEqual(mockProduct);
      expect(productRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, is_active: true } });
    });

    it('should throw error when product is not found', async () => {
      // Arrange
      productRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow('Product with ID 999 not found');
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      productRepository.findOne.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.findOne(1)).rejects.toThrow('Database error');
    });
  });

  describe('search', () => {
    it('should search products by term', async () => {
      // Arrange
      const mockProducts = [mockProduct];
      productRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockProducts)
      });

      // Act
      const result = await service.search('test');

      // Assert
      expect(result).toEqual(mockProducts);
      expect(productRepository.createQueryBuilder).toHaveBeenCalledWith('product');
    });

    it('should handle empty search results', async () => {
      // Arrange
      productRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([])
      });

      // Act
      const result = await service.search('nonexistent');

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle search errors gracefully', async () => {
      // Arrange
      productRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      // Act & Assert
      await expect(service.search('test')).rejects.toThrow('Database error');
    });
  });

  describe('findOne error handling', () => {
    it('should throw error when product is not found', async () => {
      // Arrange
      productRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow('Product with ID 999 not found');
    });
  });
});
