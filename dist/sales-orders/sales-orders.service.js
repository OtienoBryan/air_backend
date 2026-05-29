"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sales_order_entity_1 = require("../entities/sales-order.entity");
const client_entity_1 = require("../entities/client.entity");
const sales_order_item_entity_1 = require("../entities/sales-order-item.entity");
const product_entity_1 = require("../entities/product.entity");
let SalesOrdersService = class SalesOrdersService {
    salesOrderRepository;
    clientRepository;
    salesOrderItemRepository;
    productRepository;
    constructor(salesOrderRepository, clientRepository, salesOrderItemRepository, productRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.clientRepository = clientRepository;
        this.salesOrderItemRepository = salesOrderItemRepository;
        this.productRepository = productRepository;
    }
    async getSalesAnalytics(year) {
        const targetYear = year || new Date().getFullYear();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const query = `
      SELECT 
        id,
        client_id as clientId,
        order_date as orderDate,
        total_amount as totalAmount,
        recepients_name as clientName,
        my_status
      FROM sales_orders 
      WHERE YEAR(order_date) = ? AND my_status IN (1, 2, 3)
    `;
        const orders = await this.salesOrderRepository.query(query, [targetYear]);
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
            const month = new Date(0, i).toLocaleString('default', { month: 'short' });
            const monthOrders = orders.filter(order => new Date(order.orderDate).getMonth() === i);
            return {
                month,
                revenue: monthOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0),
                orders: monthOrders.length
            };
        });
        const clientMap = new Map();
        orders.forEach(order => {
            const key = order.clientId;
            if (!clientMap.has(key)) {
                clientMap.set(key, {
                    clientId: order.clientId,
                    clientName: order.clientName || `Client ${order.clientId}`,
                    totalOrders: 0,
                    totalRevenue: 0
                });
            }
            const clientData = clientMap.get(key);
            clientData.totalOrders++;
            clientData.totalRevenue += Number(order.totalAmount);
        });
        const topClients = Array.from(clientMap.values())
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, 10);
        let totalRevenue = 0;
        if (targetYear === currentYear) {
            const currentMonthOrders = orders.filter(order => new Date(order.orderDate).getMonth() === currentMonth);
            totalRevenue = currentMonthOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        }
        else {
            totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        }
        let totalOrders = 0;
        if (targetYear === currentYear) {
            const currentMonthOrders = orders.filter(order => new Date(order.orderDate).getMonth() === currentMonth);
            totalOrders = currentMonthOrders.length;
        }
        else {
            totalOrders = orders.length;
        }
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        return {
            totalRevenue,
            totalOrders,
            averageOrderValue,
            monthlyData,
            topClients
        };
    }
    async getAllClients() {
        try {
            return await this.clientRepository.find({
                order: { name: 'ASC' }
            });
        }
        catch (error) {
            console.log('Error fetching clients:', error);
            return [];
        }
    }
    async getClientSalesData(clientId, year) {
        const targetYear = year || new Date().getFullYear();
        try {
            const optimizedQuery = `
        SELECT 
          c.id as clientId,
          c.name as clientName,
          c.email as clientEmail,
          c.contact as clientPhone,
          c.region as clientCompany,
          MONTH(so.order_date) as orderMonth,
          COUNT(so.id) as monthlyOrders,
          COALESCE(SUM(so.total_amount), 0) as monthlyAmount,
          so.id as orderId,
          so.so_number as soNumber,
          so.order_date as orderDate,
          so.total_amount as totalAmount,
          so.status as orderStatus
        FROM Clients c
        LEFT JOIN sales_orders so ON c.id = so.client_id 
          AND YEAR(so.order_date) = ?
        WHERE c.id = ?
        GROUP BY c.id, c.name, c.email, c.contact, c.region, MONTH(so.order_date), so.id, so.so_number, so.order_date, so.total_amount, so.status
        ORDER BY so.order_date DESC
      `;
            const results = await this.salesOrderRepository.query(optimizedQuery, [targetYear, clientId]);
            if (!results || results.length === 0) {
                return null;
            }
            const clientInfo = results[0];
            if (!clientInfo.clientId) {
                return null;
            }
            const monthlyData = Array.from({ length: 12 }, (_, i) => ({
                month: new Date(0, i).toLocaleString('default', { month: 'short' }),
                year: targetYear,
                monthNumber: i + 1,
                totalOrders: 0,
                totalAmount: 0,
                orders: []
            }));
            const monthlyTotals = new Map();
            results.forEach(row => {
                if (row.orderMonth) {
                    const month = row.orderMonth;
                    if (!monthlyTotals.has(month)) {
                        monthlyTotals.set(month, { orders: 0, amount: 0, orderList: [] });
                    }
                    const monthData = monthlyTotals.get(month);
                    monthData.orders += row.monthlyOrders || 0;
                    monthData.amount += Number(row.monthlyAmount || 0);
                    if (row.orderId) {
                        monthData.orderList.push({
                            id: row.orderId,
                            soNumber: row.soNumber,
                            orderDate: row.orderDate,
                            totalAmount: row.totalAmount,
                            status: row.orderStatus
                        });
                    }
                }
            });
            monthlyTotals.forEach((data, month) => {
                const monthIndex = month - 1;
                if (monthIndex >= 0 && monthIndex < 12) {
                    monthlyData[monthIndex].totalOrders = data.orders;
                    monthlyData[monthIndex].totalAmount = data.amount;
                    monthlyData[monthIndex].orders = data.orderList;
                }
            });
            const totalOrders = results.reduce((sum, row) => sum + (row.monthlyOrders || 0), 0);
            const totalAmount = results.reduce((sum, row) => sum + Number(row.monthlyAmount || 0), 0);
            const averageOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;
            return {
                clientId: clientInfo.clientId,
                clientName: clientInfo.clientName,
                clientEmail: clientInfo.clientEmail || '',
                clientPhone: clientInfo.clientPhone,
                clientCompany: clientInfo.clientCompany,
                clientStatus: 'active',
                monthlyData,
                totalOrders,
                totalAmount,
                averageOrderValue
            };
        }
        catch (error) {
            console.log('Error fetching client sales data:', error);
            return null;
        }
    }
    async getBulkClientSalesData(clientIds, year) {
        const targetYear = year || new Date().getFullYear();
        if (!clientIds || clientIds.length === 0) {
            return [];
        }
        try {
            console.log(`🔍 [getBulkClientSalesData] Processing ${clientIds.length} clients for year ${targetYear}`);
            const bulkQuery = `
        SELECT 
          c.id as clientId,
          c.name as clientName,
          c.email as clientEmail,
          c.contact as clientPhone,
          c.region as clientCompany,
          so.id as orderId,
          so.so_number as soNumber,
          so.order_date as orderDate,
          so.total_amount as totalAmount,
          so.status as orderStatus
        FROM Clients c
        LEFT JOIN sales_orders so ON c.id = so.client_id 
          AND YEAR(so.order_date) = ?
        WHERE c.id IN (${clientIds.map(() => '?').join(',')})
        ORDER BY c.id, so.order_date DESC
      `;
            const results = await this.salesOrderRepository.query(bulkQuery, [targetYear, ...clientIds]);
            console.log(`📊 [getBulkClientSalesData] Query returned ${results.length} rows`);
            const clientDataMap = new Map();
            clientIds.forEach(clientId => {
                clientDataMap.set(clientId, {
                    clientId,
                    clientName: '',
                    clientEmail: '',
                    clientPhone: '',
                    clientCompany: '',
                    clientStatus: 'active',
                    monthlyData: Array.from({ length: 12 }, (_, i) => ({
                        month: new Date(0, i).toLocaleString('default', { month: 'short' }),
                        year: targetYear,
                        monthNumber: i + 1,
                        totalOrders: 0,
                        totalAmount: 0,
                        orders: []
                    })),
                    totalOrders: 0,
                    totalAmount: 0,
                    averageOrderValue: 0
                });
            });
            results.forEach(row => {
                const clientId = row.clientId;
                const clientData = clientDataMap.get(clientId);
                if (clientData) {
                    if (!clientData.clientName) {
                        clientData.clientName = row.clientName;
                        clientData.clientEmail = row.clientEmail || '';
                        clientData.clientPhone = row.clientPhone;
                        clientData.clientCompany = row.clientCompany;
                    }
                    if (row.orderId && row.orderDate) {
                        const orderDate = new Date(row.orderDate);
                        const monthIndex = orderDate.getMonth();
                        if (monthIndex >= 0 && monthIndex < 12) {
                            const monthData = clientData.monthlyData[monthIndex];
                            monthData.totalOrders += 1;
                            monthData.totalAmount += Number(row.totalAmount || 0);
                            monthData.orders.push({
                                id: row.orderId,
                                soNumber: row.soNumber,
                                orderDate: row.orderDate,
                                totalAmount: row.totalAmount,
                                status: row.orderStatus
                            });
                        }
                    }
                }
            });
            clientDataMap.forEach(clientData => {
                clientData.totalOrders = clientData.monthlyData.reduce((sum, month) => sum + month.totalOrders, 0);
                clientData.totalAmount = clientData.monthlyData.reduce((sum, month) => sum + month.totalAmount, 0);
                clientData.averageOrderValue = clientData.totalOrders > 0 ? clientData.totalAmount / clientData.totalOrders : 0;
            });
            const result = Array.from(clientDataMap.values());
            console.log(`✅ [getBulkClientSalesData] Returning ${result.length} client sales data objects`);
            result.forEach(data => {
                console.log(`📊 Client ${data.clientId} (${data.clientName}): ${data.totalOrders} orders, $${data.totalAmount} total`);
            });
            return result;
        }
        catch (error) {
            console.log('Error fetching bulk client sales data:', error);
            return [];
        }
    }
    async getAllClientSalesData(year) {
        const targetYear = year || new Date().getFullYear();
        let clients = [];
        try {
            clients = await this.clientRepository.find({
                order: { name: 'ASC' }
            });
        }
        catch (error) {
            console.log('Clients table not found, using sales_orders data only');
            const salesQuery = `
        SELECT DISTINCT 
          client_id as id,
          recepients_name as name,
          recepients_contact as contact,
          '' as email,
          '' as region,
          0 as region_id,
          '' as route_name,
          null as route_id,
          0.00 as balance
        FROM sales_orders 
        WHERE YEAR(order_date) = ?
        ORDER BY recepients_name
      `;
            const salesClients = await this.salesOrderRepository.query(salesQuery, [targetYear]);
            clients = salesClients;
        }
        const salesQuery = `
      SELECT 
        id,
        so_number as soNumber,
        client_id as clientId,
        order_date as orderDate,
        expected_delivery_date as expectedDeliveryDate,
        subtotal,
        tax_amount as taxAmount,
        total_amount as totalAmount,
        net_price as netPrice,
        notes,
        created_by as createdBy,
        salesrep,
        created_at as createdAt,
        updated_at as updatedAt,
        rider_id as riderId,
        assigned_at as assignedAt,
        recepients_name as recipientsName,
        recepients_contact as recipientsContact,
        dispatched_by as dispatchedBy,
        status,
        my_status as myStatus,
        received_into_stock as receivedIntoStock,
        delivered_at as deliveredAt,
        delivery_notes as deliveryNotes,
        received_by as receivedBy,
        received_at as receivedAt,
        delivery_image as deliveryImage,
        returned_at as returnedAt
      FROM sales_orders 
      WHERE YEAR(order_date) = ?
      ORDER BY order_date DESC
    `;
        const orders = await this.salesOrderRepository.query(salesQuery, [targetYear]);
        const ordersByClient = new Map();
        orders.forEach(order => {
            if (!ordersByClient.has(order.clientId)) {
                ordersByClient.set(order.clientId, []);
            }
            ordersByClient.get(order.clientId).push(order);
        });
        const result = clients.map(client => {
            const clientOrders = ordersByClient.get(client.id) || [];
            const monthlyData = Array.from({ length: 12 }, (_, i) => ({
                month: new Date(0, i).toLocaleString('default', { month: 'short' }),
                year: targetYear,
                monthNumber: i,
                totalOrders: 0,
                totalAmount: 0,
                orders: []
            }));
            clientOrders.forEach(order => {
                try {
                    const orderMonth = new Date(order.orderDate).getMonth();
                    const monthlyDataItem = monthlyData[orderMonth];
                    monthlyDataItem.orders.push({
                        id: order.id,
                        soNumber: order.soNumber,
                        orderDate: order.orderDate,
                        totalAmount: order.totalAmount,
                        status: order.status
                    });
                    monthlyDataItem.totalOrders++;
                    monthlyDataItem.totalAmount += Number(order.totalAmount || 0);
                }
                catch (error) {
                    console.log('Error processing order:', error);
                }
            });
            const totalOrders = clientOrders.length;
            const totalAmount = clientOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
            const averageOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;
            return {
                clientId: client.id,
                clientName: client.name || `Client ${client.id}`,
                clientEmail: client.email || '',
                clientPhone: client.contact || client.phone || '',
                clientCompany: client.region || client.company || '',
                clientStatus: 'active',
                monthlyData,
                totalOrders,
                totalAmount,
                averageOrderValue
            };
        });
        return result.sort((a, b) => {
            if (b.totalAmount !== a.totalAmount) {
                return b.totalAmount - a.totalAmount;
            }
            return a.clientName.localeCompare(b.clientName);
        });
    }
    async getSalesOrders(year, limit, offset) {
        const query = this.salesOrderRepository
            .createQueryBuilder('sales_order')
            .orderBy('sales_order.order_date', 'DESC');
        if (year) {
            query.where('YEAR(sales_order.order_date) = :year', { year });
        }
        if (limit) {
            query.limit(limit);
        }
        if (offset) {
            query.offset(offset);
        }
        return query.getMany();
    }
    async getClientOrderItems(clientId, year, month) {
        try {
            console.log(`🔍 [getClientOrderItems] Starting query for clientId: ${clientId}, year: ${year}, month: ${month}`);
            console.log('📊 [getClientOrderItems] Checking table existence...');
            const [salesOrdersCheck] = await this.salesOrderRepository.query(`
        SELECT COUNT(*) as count FROM sales_orders WHERE client_id = ?
      `, [clientId]);
            console.log(`📈 [getClientOrderItems] Sales orders for client ${clientId}:`, salesOrdersCheck[0]?.count || 0);
            const [orderItemsCheck] = await this.salesOrderRepository.query(`
        SELECT COUNT(*) as count FROM sales_order_items
      `);
            console.log(`📦 [getClientOrderItems] Total order items in table:`, orderItemsCheck[0]?.count || 0);
            const [productsCheck] = await this.salesOrderRepository.query(`
        SELECT COUNT(*) as count FROM products
      `);
            console.log(`🛍️ [getClientOrderItems] Total products in table:`, productsCheck[0]?.count || 0);
            const [yearMonthCheck] = await this.salesOrderRepository.query(`
        SELECT COUNT(*) as count FROM sales_orders 
        WHERE client_id = ? AND YEAR(order_date) = ? AND MONTH(order_date) = ?
      `, [clientId, year, month]);
            console.log(`📅 [getClientOrderItems] Sales orders for ${year}-${month}:`, yearMonthCheck[0]?.count || 0);
            const [clientSalesOrders] = await this.salesOrderRepository.query(`
        SELECT id, so_number, order_date, total_amount, client_id
        FROM sales_orders 
        WHERE client_id = ?
        ORDER BY order_date DESC
        LIMIT 5
      `, [clientId]);
            console.log(`📋 [getClientOrderItems] Recent sales orders for client ${clientId}:`, clientSalesOrders);
            const [allSalesOrders] = await this.salesOrderRepository.query(`
        SELECT id, so_number, order_date, total_amount, client_id
        FROM sales_orders 
        ORDER BY order_date DESC
        LIMIT 10
      `);
            console.log(`📋 [getClientOrderItems] Recent sales orders in database:`, allSalesOrders);
            const [productColumns] = await this.salesOrderRepository.query('DESCRIBE products');
            console.log(`🔍 [getClientOrderItems] Products table columns:`, productColumns);
            const query = `
        SELECT 
          soi.id,
          soi.sales_order_id as salesOrderId,
          soi.product_id as productId,
          p.product_name as productName,
          soi.quantity,
          soi.unit_price as unitPrice,
          soi.total_price as totalPrice,
          so.order_date as orderDate,
          so.so_number as soNumber
        FROM sales_order_items soi
        JOIN sales_orders so ON soi.sales_order_id = so.id
        JOIN products p ON soi.product_id = p.id
        WHERE so.client_id = ? 
          AND YEAR(so.order_date) = ? 
          AND MONTH(so.order_date) = ?
        ORDER BY so.order_date DESC, soi.id
      `;
            console.log(`🔍 [getClientOrderItems] Executing query:`, query);
            console.log(`🔍 [getClientOrderItems] Query parameters:`, [clientId, year, month]);
            let result = await this.salesOrderRepository.query(query, [clientId, year, month]);
            console.log(`✅ [getClientOrderItems] Query executed successfully`);
            console.log(`📊 [getClientOrderItems] Result count:`, result.length);
            console.log(`📋 [getClientOrderItems] Result data:`, JSON.stringify(result, null, 2));
            if (result.length === 0) {
                console.log(`🔄 [getClientOrderItems] No results with p.product_name, trying p.name...`);
                const fallbackQuery = `
          SELECT 
            soi.id,
            soi.sales_order_id as salesOrderId,
            soi.product_id as productId,
            p.product_name as productName,
            soi.quantity,
            soi.unit_price as unitPrice,
            soi.total_price as totalPrice,
            so.order_date as orderDate,
            so.so_number as soNumber
          FROM sales_order_items soi
          JOIN sales_orders so ON soi.sales_order_id = so.id
          JOIN products p ON soi.product_id = p.id
          WHERE so.client_id = ? 
            AND YEAR(so.order_date) = ? 
            AND MONTH(so.order_date) = ?
          ORDER BY so.order_date DESC, soi.id
        `;
                result = await this.salesOrderRepository.query(fallbackQuery, [clientId, year, month]);
                console.log(`🔄 [getClientOrderItems] Fallback query result count:`, result.length);
                console.log(`📋 [getClientOrderItems] Fallback result data:`, JSON.stringify(result, null, 2));
            }
            return result;
        }
        catch (error) {
            console.error('❌ [getClientOrderItems] Error fetching client order items:', error);
            console.error('❌ [getClientOrderItems] Error details:', {
                message: error.message,
                stack: error.stack,
                clientId,
                year,
                month
            });
            return [];
        }
    }
    async getProductPerformance(year) {
        const targetYear = year || new Date().getFullYear();
        try {
            console.log(`🔍 [getProductPerformance] Fetching product performance for year: ${targetYear}`);
            console.log('📊 [getProductPerformance] Checking database state...');
            const [productsCheck] = await this.salesOrderRepository.query('SELECT COUNT(*) as count FROM products');
            console.log(`📦 [getProductPerformance] Total products in database:`, productsCheck[0]?.count || 0);
            const [salesOrdersCheck] = await this.salesOrderRepository.query('SELECT COUNT(*) as count FROM sales_orders');
            console.log(`📈 [getProductPerformance] Total sales orders in database:`, salesOrdersCheck[0]?.count || 0);
            const [orderItemsCheck] = await this.salesOrderRepository.query('SELECT COUNT(*) as count FROM sales_order_items');
            console.log(`📋 [getProductPerformance] Total order items in database:`, orderItemsCheck[0]?.count || 0);
            const [yearCheck] = await this.salesOrderRepository.query(`
        SELECT COUNT(*) as count FROM sales_orders 
        WHERE YEAR(order_date) = ?
      `, [targetYear]);
            console.log(`📅 [getProductPerformance] Sales orders for year ${targetYear}:`, yearCheck[0]?.count || 0);
            const [sampleProducts] = await this.salesOrderRepository.query('SELECT id, product_name FROM products LIMIT 5');
            console.log(`🛍️ [getProductPerformance] Sample products:`, sampleProducts);
            const [sampleSalesOrders] = await this.salesOrderRepository.query(`
        SELECT id, so_number, order_date, client_id, my_status FROM sales_orders 
        ORDER BY order_date DESC LIMIT 5
      `);
            console.log(`📋 [getProductPerformance] Sample sales orders:`, sampleSalesOrders);
            const [status3Orders] = await this.salesOrderRepository.query(`
        SELECT COUNT(*) as count FROM sales_orders WHERE my_status = 3
      `);
            console.log(`📊 [getProductPerformance] Sales orders with my_status = 3:`, status3Orders[0]?.count || 0);
            const [sampleOrderItems] = await this.salesOrderRepository.query(`
        SELECT soi.id, soi.sales_order_id, soi.product_id, soi.quantity, soi.total_price
        FROM sales_order_items soi LIMIT 5
      `);
            console.log(`📦 [getProductPerformance] Sample order items:`, sampleOrderItems);
            const productsQuery = `
        SELECT DISTINCT 
          p.id,
          p.product_name,
          p.description,
          p.category_id,
          p.is_active
        FROM products p
        INNER JOIN sales_order_items soi ON p.id = soi.product_id
        INNER JOIN sales_orders so ON soi.sales_order_id = so.id
        WHERE so.my_status = 3 
          AND (so.order_date IS NULL OR YEAR(so.order_date) = ?)
        ORDER BY p.product_name ASC
      `;
            console.log(`🔍 [getProductPerformance] Executing products query:`, productsQuery);
            console.log(`🔍 [getProductPerformance] Query parameters:`, [targetYear]);
            const products = await this.salesOrderRepository.query(productsQuery, [targetYear]);
            console.log(`📦 [getProductPerformance] Found ${products.length} products with sales data`);
            console.log(`📦 [getProductPerformance] Products:`, products.map(p => ({ id: p.id, name: p.product_name, isActive: p.is_active })));
            if (products.length === 0) {
                console.log(`❌ [getProductPerformance] No products found with sales data for year ${targetYear}`);
                const [anyProductsWithSales] = await this.salesOrderRepository.query(`
          SELECT DISTINCT p.id, p.product_name
          FROM products p
          INNER JOIN sales_order_items soi ON p.id = soi.product_id
          INNER JOIN sales_orders so ON soi.sales_order_id = so.id
          LIMIT 5
        `);
                console.log(`🔍 [getProductPerformance] Any products with sales data (any year):`, anyProductsWithSales);
                return [];
            }
            const productPerformanceData = [];
            for (const product of products) {
                const query = `
          SELECT 
            p.id as productId,
            p.product_name as productName,
            COALESCE(SUM(soi.quantity), 0) as totalQuantitySold,
            COALESCE(SUM(soi.total_price), 0) as totalRevenue,
            COALESCE(AVG(soi.unit_price), 0) as averagePrice,
            COALESCE(COUNT(DISTINCT soi.sales_order_id), 0) as orderCount,
            MAX(so.order_date) as lastSoldDate,
            MONTH(so.order_date) as month,
            MONTHNAME(so.order_date) as monthName,
            COALESCE(SUM(soi.quantity), 0) as monthlyQuantity,
            COALESCE(SUM(soi.total_price), 0) as monthlyRevenue,
            COALESCE(COUNT(DISTINCT soi.sales_order_id), 0) as monthlyOrderCount
          FROM products p
          INNER JOIN sales_order_items soi ON p.id = soi.product_id
          INNER JOIN sales_orders so ON soi.sales_order_id = so.id
          WHERE p.id = ? 
            AND so.my_status = 3
            AND (so.order_date IS NULL OR YEAR(so.order_date) = ?)
          GROUP BY p.id, p.product_name, MONTH(so.order_date)
          ORDER BY p.product_name, MONTH(so.order_date)
        `;
                const monthlyData = await this.salesOrderRepository.query(query, [product.id, targetYear]);
                const totalsQuery = `
          SELECT 
            COALESCE(SUM(soi.quantity), 0) as totalQuantitySold,
            COALESCE(SUM(soi.total_price), 0) as totalRevenue,
            COALESCE(AVG(soi.unit_price), 0) as averagePrice,
            COALESCE(COUNT(DISTINCT soi.sales_order_id), 0) as orderCount,
            MAX(so.order_date) as lastSoldDate
          FROM products p
          INNER JOIN sales_order_items soi ON p.id = soi.product_id
          INNER JOIN sales_orders so ON soi.sales_order_id = so.id
          WHERE p.id = ? 
            AND so.my_status = 3
            AND (so.order_date IS NULL OR YEAR(so.order_date) = ?)
        `;
                const [totals] = await this.salesOrderRepository.query(totalsQuery, [product.id, targetYear]);
                const monthlyMap = new Map();
                monthlyData.forEach((row) => {
                    monthlyMap.set(row.month, {
                        month: row.monthName,
                        monthNumber: row.month,
                        quantity: parseInt(row.monthlyQuantity) || 0,
                        revenue: parseFloat(row.monthlyRevenue) || 0,
                        orderCount: parseInt(row.monthlyOrderCount) || 0
                    });
                });
                const monthlyDataArray = [];
                for (let month = 1; month <= 12; month++) {
                    const monthName = new Date(targetYear, month - 1).toLocaleString('default', { month: 'long' });
                    const existingData = monthlyMap.get(month);
                    monthlyDataArray.push(existingData || {
                        month: monthName,
                        monthNumber: month,
                        quantity: 0,
                        revenue: 0,
                        orderCount: 0
                    });
                }
                productPerformanceData.push({
                    productId: product.id,
                    productName: product.product_name,
                    totalQuantitySold: parseInt(totals?.totalQuantitySold) || 0,
                    totalRevenue: parseFloat(totals?.totalRevenue) || 0,
                    averagePrice: parseFloat(totals?.averagePrice) || 0,
                    orderCount: parseInt(totals?.orderCount) || 0,
                    lastSoldDate: totals?.lastSoldDate ? new Date(totals.lastSoldDate) : new Date(),
                    monthlyData: monthlyDataArray
                });
            }
            console.log(`✅ [getProductPerformance] Successfully fetched performance data for ${productPerformanceData.length} products`);
            return productPerformanceData;
        }
        catch (error) {
            console.error('❌ [getProductPerformance] Error fetching product performance:', error);
            return [];
        }
    }
    async getProductPerformanceSummary(year) {
        const targetYear = year || new Date().getFullYear();
        try {
            console.log(`🔍 [getProductPerformanceSummary] Fetching product performance summary for year: ${targetYear}`);
            const query = `
        SELECT 
          COUNT(DISTINCT p.id) as totalProducts,
          COALESCE(SUM(soi.total_price), 0) as totalRevenue,
          COALESCE(SUM(soi.quantity), 0) as totalQuantitySold,
          COALESCE(AVG(soi.total_price), 0) as averageOrderValue
        FROM products p
        INNER JOIN sales_order_items soi ON p.id = soi.product_id
        INNER JOIN sales_orders so ON soi.sales_order_id = so.id
        WHERE so.my_status = 3 
          AND (so.order_date IS NULL OR YEAR(so.order_date) = ?)
      `;
            const [summary] = await this.salesOrderRepository.query(query, [targetYear]);
            const topProductQuery = `
        SELECT 
          p.product_name as productName,
          COALESCE(SUM(soi.total_price), 0) as revenue
        FROM products p
        INNER JOIN sales_order_items soi ON p.id = soi.product_id
        INNER JOIN sales_orders so ON soi.sales_order_id = so.id
        WHERE so.my_status = 3 
          AND (so.order_date IS NULL OR YEAR(so.order_date) = ?)
        GROUP BY p.id, p.product_name
        ORDER BY revenue DESC
        LIMIT 1
      `;
            const [topProduct] = await this.salesOrderRepository.query(topProductQuery, [targetYear]);
            return {
                totalProducts: parseInt(summary?.totalProducts) || 0,
                totalRevenue: parseFloat(summary?.totalRevenue) || 0,
                totalQuantitySold: parseInt(summary?.totalQuantitySold) || 0,
                averageOrderValue: parseFloat(summary?.averageOrderValue) || 0,
                topPerformingProduct: {
                    productName: topProduct?.productName || 'No sales',
                    revenue: parseFloat(topProduct?.revenue) || 0
                }
            };
        }
        catch (error) {
            console.error('❌ [getProductPerformanceSummary] Error fetching product performance summary:', error);
            return {
                totalProducts: 0,
                totalRevenue: 0,
                totalQuantitySold: 0,
                averageOrderValue: 0,
                topPerformingProduct: {
                    productName: 'No data',
                    revenue: 0
                }
            };
        }
    }
};
exports.SalesOrdersService = SalesOrdersService;
exports.SalesOrdersService = SalesOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sales_order_entity_1.SalesOrder)),
    __param(1, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(2, (0, typeorm_1.InjectRepository)(sales_order_item_entity_1.SalesOrderItem)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SalesOrdersService);
//# sourceMappingURL=sales-orders.service.js.map