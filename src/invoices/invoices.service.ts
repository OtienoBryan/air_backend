import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesOrder } from '../entities/sales-order.entity';
import { Client } from '../entities/client.entity';

export interface InvoiceData {
  id: number;
  soNumber: string;
  clientId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  orderDate: Date;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  netPrice: number;
  notes: string | null;
  createdBy: string | null;
  salesrep: number | null;
  createdAt: Date;
  updatedAt: Date;
  riderId: number | null;
  assignedAt: Date | null;
  recipientsName: string | null;
  recipientsContact: string | null;
  dispatchedBy: number | null;
  status: string;
  receivedIntoStock: boolean;
  deliveredAt: Date | null;
  deliveryNotes: string | null;
  receivedBy: number | null;
  receivedAt: Date | null;
  deliveryImage: string | null;
  returnedAt: Date | null;
}

export interface InvoiceSummary {
  totalInvoices: number;
  totalAmount: number;
  totalSubtotal: number;
  totalTax: number;
  statusCounts: {
    draft: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    inPayment: number;
    paid: number;
  };
  myStatusCounts: {
    status1: number;
    status2: number;
    status3: number;
    status4: number;
    status5: number;
  };
}

@Injectable()
export class InvoicesService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    @InjectRepository(SalesOrder)
    private salesOrderRepository: Repository<SalesOrder>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  private getCacheKey(prefix: string, ...params: any[]): string {
    return `${prefix}:${params.join(':')}`;
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private clearCache(): void {
    this.cache.clear();
  }

  async getInvoices(page: number = 1, limit: number = 10, search?: string, status?: string, myStatus?: string): Promise<{ invoices: InvoiceData[], total: number }> {
    try {
      console.log('🔍 [Invoices] ===== STARTING OPTIMIZED INVOICE FETCH =====');
      console.log('🔍 [Invoices] Parameters:', { page, limit, search, status, myStatus });

      // Check cache first (only for non-search, non-filter queries)
      if (!search && !status && !myStatus) {
        const cacheKey = this.getCacheKey('invoices', page.toString(), limit.toString());
        const cachedData = this.getCachedData<{ invoices: InvoiceData[], total: number }>(cacheKey);
        if (cachedData) {
          console.log('✅ [Invoices] Returning cached data');
          return cachedData;
        }
      }
      
      // Build optimized query with proper indexing hints
      const query = this.salesOrderRepository
        .createQueryBuilder('so')
        .leftJoin('Clients', 'c', 'so.client_id = c.id')
        .select([
          'so.id as so_id',
          'so.so_number as so_so_number',
          'so.client_id as so_client_id',
          'so.order_date as so_order_date',
          'so.subtotal as so_subtotal',
          'so.tax_amount as so_tax_amount',
          'so.total_amount as so_total_amount',
          'so.net_price as so_net_price',
          'so.notes as so_notes',
          'so.created_by as so_created_by',
          'so.salesrep as so_salesrep',
          'so.created_at as so_created_at',
          'so.updated_at as so_updated_at',
          'so.rider_id as so_rider_id',
          'so.assigned_at as so_assigned_at',
          'so.recepients_name as so_recepients_name',
          'so.recepients_contact as so_recepients_contact',
          'so.dispatched_by as so_dispatched_by',
          'so.status as so_status',
          'so.received_into_stock as so_received_into_stock',
          'so.delivered_at as so_delivered_at',
          'so.delivery_notes as so_delivery_notes',
          'so.received_by as so_received_by',
          'so.received_at as so_received_at',
          'so.delivery_image as so_delivery_image',
          'so.returned_at as so_returned_at',
          'c.name as clientName',
          'c.email as clientEmail',
          'c.contact as clientPhone'
        ]);

      // Apply filters with optimized conditions
      if (search) {
        // Use full-text search if available, otherwise use LIKE with proper indexing
        query.andWhere(
          '(MATCH(so.so_number, so.notes) AGAINST(:search IN BOOLEAN MODE) OR c.name LIKE :search OR c.email LIKE :search OR c.contact LIKE :search)',
          { search: `%${search}%` }
        );
      }

      if (status) {
        query.andWhere('so.status = :status', { status });
      }

      if (myStatus) {
        // Handle my_status filtering - support single value or comma-separated values
        if (myStatus.includes(',')) {
          const statusValues = myStatus.split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s));
          if (statusValues.length > 0) {
            query.andWhere('so.my_status IN (:...myStatusValues)', { myStatusValues: statusValues });
          }
        } else {
          const statusValue = parseInt(myStatus);
          if (!isNaN(statusValue)) {
            query.andWhere('so.my_status = :myStatus', { myStatus: statusValue });
          }
        }
      }

      // Optimize count query - use approximate count for large datasets
      let total: number;
      if (page === 1 && !search && !status && !myStatus) {
        // For first page without filters, use approximate count for better performance
        try {
          const countResult = await this.salesOrderRepository.query(
            'SELECT TABLE_ROWS as count FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = "sales_orders"'
          );
          total = countResult[0]?.count || 0;
        } catch {
          // Fallback to exact count if approximate fails
          total = await query.getCount();
        }
      } else {
        // Use exact count for filtered results
        total = await query.getCount();
      }

      console.log('🔍 [Invoices] Total count:', total);

      // Apply pagination with optimized ordering
      const offset = (page - 1) * limit;
      console.log('🔍 [Invoices] Pagination:', { offset, limit });
      
      console.log('🔍 [Invoices] Executing optimized query...');
      const invoices = await query
        .orderBy('so.created_at', 'DESC')
        .addOrderBy('so.id', 'DESC') // Secondary sort for consistent pagination
        .offset(offset)
        .limit(limit)
        .getRawMany();

      console.log(`✅ [Invoices] Query executed successfully`);
      console.log(`✅ [Invoices] Found ${invoices.length} invoices out of ${total} total`);

      const invoiceData: InvoiceData[] = invoices.map(invoice => ({
        id: invoice.so_id,
        soNumber: invoice.so_so_number || `SO-${String(invoice.so_id).padStart(4, '0')}`,
        clientId: invoice.so_client_id,
        clientName: invoice.clientName || 'Unknown Client',
        clientEmail: invoice.clientEmail || '',
        clientPhone: invoice.clientPhone || '',
        orderDate: invoice.so_order_date || null,
        subtotal: Number(invoice.so_subtotal || 0),
        taxAmount: Number(invoice.so_tax_amount || 0),
        totalAmount: Number(invoice.so_total_amount || 0),
        netPrice: Number(invoice.so_net_price || 0),
        notes: invoice.so_notes,
        createdBy: invoice.so_created_by,
        salesrep: invoice.so_salesrep,
        createdAt: invoice.so_created_at,
        updatedAt: invoice.so_updated_at,
        riderId: invoice.so_rider_id,
        assignedAt: invoice.so_assigned_at,
        recipientsName: invoice.so_recepients_name,
        recipientsContact: invoice.so_recepients_contact,
        dispatchedBy: invoice.so_dispatched_by,
        status: invoice.so_status,
        receivedIntoStock: Boolean(invoice.so_received_into_stock),
        deliveredAt: invoice.so_delivered_at,
        deliveryNotes: invoice.so_delivery_notes,
        receivedBy: invoice.so_received_by,
        receivedAt: invoice.so_received_at,
        deliveryImage: invoice.so_delivery_image,
        returnedAt: invoice.so_returned_at,
      }));

      console.log('✅ [Invoices] ===== OPTIMIZED INVOICE FETCH COMPLETED SUCCESSFULLY =====');
      
      const result = { invoices: invoiceData, total };
      
      // Cache the result for non-search, non-filter queries
      if (!search && !status && !myStatus) {
        const cacheKey = this.getCacheKey('invoices', page.toString(), limit.toString());
        this.setCachedData(cacheKey, result);
        console.log('✅ [Invoices] Data cached for future requests');
      }
      
      return result;
    } catch (error) {
      console.error('❌ [Invoices] ===== ERROR IN INVOICE FETCH =====');
      console.error('❌ [Invoices] Error type:', error.constructor.name);
      console.error('❌ [Invoices] Error message:', error.message);
      console.error('❌ [Invoices] Error stack:', error.stack);
      throw error;
    }
  }

  async getInvoiceSummary(): Promise<InvoiceSummary> {
    try {
      console.log('🔍 [Invoices] Fetching optimized invoice summary...');

      // Check cache first
      const cacheKey = this.getCacheKey('summary');
      const cachedData = this.getCachedData<InvoiceSummary>(cacheKey);
      if (cachedData) {
        console.log('✅ [Invoices] Returning cached summary data');
        return cachedData;
      }

      // Use a single optimized query to get all summary data
      const summaryQuery = `
        SELECT 
          COUNT(*) as totalInvoices,
          COALESCE(SUM(total_amount), 0) as totalAmount,
          COALESCE(SUM(subtotal), 0) as totalSubtotal,
          COALESCE(SUM(tax_amount), 0) as totalTax,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
          SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
          SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) as shipped,
          SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
          SUM(CASE WHEN status = 'in payment' THEN 1 ELSE 0 END) as inPayment,
          SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid,
          SUM(CASE WHEN my_status = 1 THEN 1 ELSE 0 END) as status1,
          SUM(CASE WHEN my_status = 2 THEN 1 ELSE 0 END) as status2,
          SUM(CASE WHEN my_status = 3 THEN 1 ELSE 0 END) as status3,
          SUM(CASE WHEN my_status = 4 THEN 1 ELSE 0 END) as status4,
          SUM(CASE WHEN my_status = 5 THEN 1 ELSE 0 END) as status5
        FROM sales_orders
      `;

      const result = await this.salesOrderRepository.query(summaryQuery);
      const summaryData = result[0];

      const summary: InvoiceSummary = {
        totalInvoices: Number(summaryData.totalInvoices || 0),
        totalAmount: Number(summaryData.totalAmount || 0),
        totalSubtotal: Number(summaryData.totalSubtotal || 0),
        totalTax: Number(summaryData.totalTax || 0),
        statusCounts: {
          draft: Number(summaryData.draft || 0),
          confirmed: Number(summaryData.confirmed || 0),
          shipped: Number(summaryData.shipped || 0),
          delivered: Number(summaryData.delivered || 0),
          cancelled: Number(summaryData.cancelled || 0),
          inPayment: Number(summaryData.inPayment || 0),
          paid: Number(summaryData.paid || 0),
        },
        myStatusCounts: {
          status1: Number(summaryData.status1 || 0),
          status2: Number(summaryData.status2 || 0),
          status3: Number(summaryData.status3 || 0),
          status4: Number(summaryData.status4 || 0),
          status5: Number(summaryData.status5 || 0),
        }
      };

      console.log('✅ [Invoices] Optimized summary calculated:', summary);
      
      // Cache the summary data
      this.setCachedData(cacheKey, summary);
      console.log('✅ [Invoices] Summary data cached for future requests');
      
      return summary;
    } catch (error) {
      console.error('❌ [Invoices] Error calculating summary:', error);
      throw error;
    }
  }

  async getInvoiceOrderItems(invoiceId: number): Promise<any[]> {
    try {
      console.log(`🔍 [Invoices] Fetching order items for invoice ${invoiceId}...`);

      const query = `
        SELECT 
          soi.id,
          soi.sales_order_id as salesOrderId,
          soi.product_id as productId,
          COALESCE(p.product_name, 'Unknown Product') as productName,
          soi.quantity,
          soi.unit_price as unitPrice,
          soi.tax_amount as taxAmount,
          soi.total_price as totalPrice,
          soi.tax_type as taxType,
          soi.net_price as netPrice,
          soi.unit_cost as unitCost,
          soi.cost_price as costPrice,
          soi.shipped_quantity as shippedQuantity
        FROM sales_order_items soi
        LEFT JOIN products p ON soi.product_id = p.id
        WHERE soi.sales_order_id = ?
        ORDER BY soi.id
      `;

      const orderItems = await this.salesOrderRepository.query(query, [invoiceId]);
      
      console.log(`✅ [Invoices] Found ${orderItems.length} order items for invoice ${invoiceId}`);
      return orderItems;
    } catch (error) {
      console.error(`❌ [Invoices] Error fetching order items for invoice ${invoiceId}:`, error);
      return [];
    }
  }

  async getInvoiceById(id: number): Promise<InvoiceData | null> {
    try {
      console.log(`🔍 [Invoices] Fetching invoice ${id}...`);

      const invoice = await this.salesOrderRepository
        .createQueryBuilder('so')
        .leftJoin('Clients', 'c', 'so.client_id = c.id')
        .select([
          'so.id as so_id',
          'so.so_number as so_so_number',
          'so.client_id as so_client_id',
          'so.order_date as so_order_date',
          'so.subtotal as so_subtotal',
          'so.tax_amount as so_tax_amount',
          'so.total_amount as so_total_amount',
          'so.net_price as so_net_price',
          'so.notes as so_notes',
          'so.created_by as so_created_by',
          'so.salesrep as so_salesrep',
          'so.created_at as so_created_at',
          'so.updated_at as so_updated_at',
          'so.rider_id as so_rider_id',
          'so.assigned_at as so_assigned_at',
          'so.recepients_name as so_recepients_name',
          'so.recepients_contact as so_recepients_contact',
          'so.dispatched_by as so_dispatched_by',
          'so.status as so_status',
          'so.received_into_stock as so_received_into_stock',
          'so.delivered_at as so_delivered_at',
          'so.delivery_notes as so_delivery_notes',
          'so.received_by as so_received_by',
          'so.received_at as so_received_at',
          'so.delivery_image as so_delivery_image',
          'so.returned_at as so_returned_at',
          'c.name as clientName',
          'c.email as clientEmail',
          'c.contact as clientPhone'
        ])
        .where('so.id = :id', { id })
        .getRawOne();

      if (!invoice) {
        console.log(`⚠️ [Invoices] Invoice ${id} not found`);
        return null;
      }

      // Debug SO number and order date fields specifically
      console.log('🔍 [Invoices] SO Number and Order Date field debug for single invoice:');
      console.log(`🔍 [Invoices] Invoice ${id}:`, {
        id: invoice.so_id,
        so_so_number: invoice.so_so_number,
        so_so_number_type: typeof invoice.so_so_number,
        so_so_number_length: invoice.so_so_number ? invoice.so_so_number.length : 'null/undefined',
        so_order_date: invoice.so_order_date,
        so_order_date_type: typeof invoice.so_order_date,
        so_order_date_formatted: invoice.so_order_date ? new Date(invoice.so_order_date).toISOString() : 'null/undefined'
      });

      const invoiceData: InvoiceData = {
        id: invoice.so_id,
        soNumber: invoice.so_so_number || `SO-${String(invoice.so_id).padStart(4, '0')}`, // Generate SO number if missing
        clientId: invoice.so_client_id,
        clientName: invoice.clientName || 'Unknown Client',
        clientEmail: invoice.clientEmail || '',
        clientPhone: invoice.clientPhone || '',
        orderDate: invoice.so_order_date || null, // Handle null/undefined order dates
        subtotal: Number(invoice.so_subtotal || 0),
        taxAmount: Number(invoice.so_tax_amount || 0),
        totalAmount: Number(invoice.so_total_amount || 0),
        netPrice: Number(invoice.so_net_price || 0),
        notes: invoice.so_notes,
        createdBy: invoice.so_created_by,
        salesrep: invoice.so_salesrep,
        createdAt: invoice.so_created_at,
        updatedAt: invoice.so_updated_at,
        riderId: invoice.so_rider_id,
        assignedAt: invoice.so_assigned_at,
        recipientsName: invoice.so_recepients_name,
        recipientsContact: invoice.so_recepients_contact,
        dispatchedBy: invoice.so_dispatched_by,
        status: invoice.so_status,
        receivedIntoStock: Boolean(invoice.so_received_into_stock),
        deliveredAt: invoice.so_delivered_at,
        deliveryNotes: invoice.so_delivery_notes,
        receivedBy: invoice.so_received_by,
        receivedAt: invoice.so_received_at,
        deliveryImage: invoice.so_delivery_image,
        returnedAt: invoice.so_returned_at,
      };

      console.log(`✅ [Invoices] Invoice ${id} found:`, invoiceData.soNumber);
      return invoiceData;
    } catch (error) {
      console.error(`❌ [Invoices] Error fetching invoice ${id}:`, error);
      throw error;
    }
  }
}
