import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { PurchaseOrder, PurchaseOrderStatus } from '../entities/purchase-order.entity';
import { PurchaseOrderItem } from '../entities/purchase-order-item.entity';

export interface PurchaseOrderStats {
  total: number;
  draft: number;
  sent: number;
  received: number;
  cancelled: number;
  totalAmount: number;
  totalPaid: number;
  totalBalance: number;
}

export interface CreatePurchaseOrderDto {
  po_number: string;
  invoice_number: string;
  supplier_id: number;
  order_date: Date;
  expected_delivery_date?: Date;
  status?: PurchaseOrderStatus;
  subtotal?: number;
  tax_amount?: number;
  total_amount?: number;
  amount_paid: number;
  balance: number;
  notes?: string;
  created_by: number;
}

export interface UpdatePurchaseOrderDto {
  po_number?: string;
  invoice_number?: string;
  supplier_id?: number;
  order_date?: Date;
  expected_delivery_date?: Date;
  status?: PurchaseOrderStatus;
  subtotal?: number;
  tax_amount?: number;
  total_amount?: number;
  amount_paid?: number;
  balance?: number;
  notes?: string;
}

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private purchaseOrderItemRepository: Repository<PurchaseOrderItem>,
  ) {}

  async findAll(
    page: number = 1, 
    limit: number = 10, 
    search?: string, 
    status?: string,
    supplierId?: number,
    startDate?: string,
    endDate?: string
  ): Promise<{ purchaseOrders: PurchaseOrder[], total: number }> {
    const queryBuilder = this.purchaseOrderRepository.createQueryBuilder('po')
      .leftJoinAndSelect('po.supplier', 'supplier');

    // Apply search filter
    if (search) {
      queryBuilder.where(
        '(po.po_number LIKE :search OR po.invoice_number LIKE :search OR supplier.company_name LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply status filter
    if (status && Object.values(PurchaseOrderStatus).includes(status as PurchaseOrderStatus)) {
      queryBuilder.andWhere('po.status = :status', { status });
    }

    // Apply supplier filter
    if (supplierId) {
      queryBuilder.andWhere('po.supplier_id = :supplierId', { supplierId });
    }

    // Apply date range filter
    if (startDate && endDate) {
      queryBuilder.andWhere('po.order_date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      });
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Order by order date (newest first)
    queryBuilder.orderBy('po.order_date', 'DESC');

    const [purchaseOrders, total] = await queryBuilder.getManyAndCount();

    return { purchaseOrders, total };
  }

  async findBySupplier(supplierId: number): Promise<PurchaseOrder[]> {
    return this.purchaseOrderRepository.find({
      where: { supplier_id: supplierId },
      relations: ['supplier'],
      order: { order_date: 'DESC' }
    });
  }

  async findOne(id: number): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: ['supplier']
    });
    
    if (!purchaseOrder) {
      throw new NotFoundException(`Purchase order with ID ${id} not found`);
    }
    
    return purchaseOrder;
  }

  async findByPoNumber(po_number: string): Promise<PurchaseOrder | null> {
    return this.purchaseOrderRepository.findOne({
      where: { po_number },
      relations: ['supplier', 'creator']
    });
  }

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    // Check if PO number already exists
    const existingPO = await this.findByPoNumber(createPurchaseOrderDto.po_number);
    if (existingPO) {
      throw new Error('PO number already exists');
    }

    const purchaseOrder = this.purchaseOrderRepository.create(createPurchaseOrderDto);
    return this.purchaseOrderRepository.save(purchaseOrder);
  }

  async update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const purchaseOrder = await this.findOne(id);

    // Check if new PO number already exists (if being updated)
    if (updatePurchaseOrderDto.po_number && updatePurchaseOrderDto.po_number !== purchaseOrder.po_number) {
      const existingPO = await this.findByPoNumber(updatePurchaseOrderDto.po_number);
      if (existingPO) {
        throw new Error('PO number already exists');
      }
    }

    Object.assign(purchaseOrder, updatePurchaseOrderDto);
    return this.purchaseOrderRepository.save(purchaseOrder);
  }

  async remove(id: number): Promise<void> {
    const purchaseOrder = await this.findOne(id);
    await this.purchaseOrderRepository.remove(purchaseOrder);
  }

  async getStats(): Promise<PurchaseOrderStats> {
    const total = await this.purchaseOrderRepository.count();
    
    const statusCounts = await this.purchaseOrderRepository
      .createQueryBuilder('po')
      .select('po.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('po.status')
      .getRawMany();

    const statusMap = statusCounts.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {} as Record<string, number>);

    const amountStats = await this.purchaseOrderRepository
      .createQueryBuilder('po')
      .select('SUM(po.total_amount)', 'totalAmount')
      .addSelect('SUM(po.amount_paid)', 'totalPaid')
      .addSelect('SUM(po.balance)', 'totalBalance')
      .getRawOne();

    return {
      total,
      draft: statusMap[PurchaseOrderStatus.DRAFT] || 0,
      sent: statusMap[PurchaseOrderStatus.SENT] || 0,
      received: statusMap[PurchaseOrderStatus.RECEIVED] || 0,
      cancelled: statusMap[PurchaseOrderStatus.CANCELLED] || 0,
      totalAmount: parseFloat(amountStats.totalAmount) || 0,
      totalPaid: parseFloat(amountStats.totalPaid) || 0,
      totalBalance: parseFloat(amountStats.totalBalance) || 0,
    };
  }

  async getSupplierStats(supplierId: number): Promise<{
    totalOrders: number;
    totalAmount: number;
    totalPaid: number;
    totalBalance: number;
    recentOrders: PurchaseOrder[];
  }> {
    const orders = await this.findBySupplier(supplierId);
    
    const totalAmount = orders.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0);
    const totalPaid = orders.reduce((sum, order) => sum + parseFloat(order.amount_paid.toString()), 0);
    const totalBalance = orders.reduce((sum, order) => sum + parseFloat(order.balance.toString()), 0);

    return {
      totalOrders: orders.length,
      totalAmount,
      totalPaid,
      totalBalance,
      recentOrders: orders.slice(0, 10) // Last 10 orders
    };
  }

  async getPurchaseOrderItems(purchaseOrderId: number): Promise<PurchaseOrderItem[]> {
    return this.purchaseOrderItemRepository.find({
      where: { purchase_order_id: purchaseOrderId },
      relations: ['product'],
      order: { id: 'ASC' }
    });
  }

  async createPurchaseOrderWithItems(createData: {
    po_number: string;
    invoice_number: string;
    supplier_id: number;
    order_date: string;
    expected_delivery_date?: string;
    notes?: string;
    created_by: number;
    items: {
      product_id: number;
      quantity: number;
      unit_price: number;
      tax_amount?: number;
      tax_type?: string;
    }[];
  }): Promise<PurchaseOrder> {
    const queryRunner = this.purchaseOrderRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Calculate totals
      let subtotal = 0;
      let totalTaxAmount = 0;

      for (const item of createData.items) {
        const itemTotal = item.quantity * item.unit_price;
        subtotal += itemTotal;
        totalTaxAmount += item.tax_amount || 0;
      }

      const totalAmount = subtotal + totalTaxAmount;

      // Create purchase order
      const purchaseOrder = this.purchaseOrderRepository.create({
        po_number: createData.po_number,
        invoice_number: createData.invoice_number,
        supplier_id: createData.supplier_id,
        order_date: new Date(createData.order_date),
        expected_delivery_date: createData.expected_delivery_date ? new Date(createData.expected_delivery_date) : null,
        status: PurchaseOrderStatus.DRAFT,
        subtotal,
        tax_amount: totalTaxAmount,
        total_amount: totalAmount,
        amount_paid: 0,
        balance: totalAmount,
        notes: createData.notes,
        created_by: createData.created_by
      });

      const savedPurchaseOrder = await queryRunner.manager.save(PurchaseOrder, purchaseOrder);

      // Create purchase order items
      const purchaseOrderItems = createData.items.map(item => {
        const itemTotal = item.quantity * item.unit_price;
        return this.purchaseOrderItemRepository.create({
          purchase_order_id: savedPurchaseOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: itemTotal,
          received_quantity: 0,
          tax_amount: item.tax_amount || 0,
          tax_type: item.tax_type || 'VAT'
        });
      });

      await queryRunner.manager.save(PurchaseOrderItem, purchaseOrderItems);

      await queryRunner.commitTransaction();

      // Return the created purchase order with items and supplier
      return this.findOne(savedPurchaseOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
