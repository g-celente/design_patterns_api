import { OrderService } from '../services/OrderService.js';
import { Order } from '../models/Order.js';
import {
  NoDiscountStrategy,
  PercentageDiscountStrategy,
  FixedAmountDiscountStrategy,
  TieredDiscountStrategy,
  FirstOrderDiscountStrategy,
  BlackFridayDiscountStrategy,
  CouponDiscountStrategy
} from '../strategies/DiscountStrategies.js';

/**
 * OrderController - Controlador REST para pedidos
 */
export class OrderController {
  constructor() {
    this.service = new OrderService();
  }

  /**
   * GET /api/orders
   * Lista todos os pedidos
   */
  async getAll(req, res) {
    try {
      const orders = await this.service.getAllOrders();
      
      res.status(200).json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/orders/:id
   * Busca pedido por ID
   */
  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const order = await this.service.getOrderById(id);
      
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/orders
   * Cria novo pedido
   * 
   * Body pode incluir:
   * - discountType: 'none', 'percentage', 'fixed', 'tiered', 'first-order', 'black-friday', 'coupon'
   * - discountValue: valor do desconto (para percentage e fixed)
   * - couponCode: código do cupom (para coupon)
   */
  async create(req, res) {
    try {
      // Definir estratégia de desconto baseado nos parâmetros
      const discountType = req.body.discountType || 'none';
      let strategy;

      switch (discountType) {
        case 'percentage':
          strategy = new PercentageDiscountStrategy(req.body.discountValue || 10);
          break;
        case 'fixed':
          strategy = new FixedAmountDiscountStrategy(req.body.discountValue || 50);
          break;
        case 'tiered':
          strategy = new TieredDiscountStrategy();
          break;
        case 'first-order':
          strategy = new FirstOrderDiscountStrategy();
          break;
        case 'black-friday':
          strategy = new BlackFridayDiscountStrategy();
          break;
        case 'coupon':
          strategy = new CouponDiscountStrategy(
            req.body.couponCode || 'WELCOME10',
            req.body.discountValue || 10,
            req.body.minOrderValue || 0
          );
          break;
        default:
          strategy = new NoDiscountStrategy();
      }

      this.service.setDiscountStrategy(strategy);

      const order = await this.service.createOrder(req.body);
      
      res.status(201).json({
        success: true,
        data: order,
        message: 'Pedido criado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * PUT /api/orders/:id
   * Atualiza status do pedido
   */
  async updateStatus(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'Status é obrigatório'
        });
      }

      // Validar status
      if (!Object.values(Order.STATUS).includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Status inválido. Use: ${Object.values(Order.STATUS).join(', ')}`
        });
      }

      const order = await this.service.updateOrderStatus(id, status);
      
      res.status(200).json({
        success: true,
        data: order,
        message: 'Status atualizado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/orders/:id
   * Cancela pedido
   */
  async cancel(req, res) {
    try {
      const id = parseInt(req.params.id);
      const order = await this.service.cancelOrder(id);
      
      res.status(200).json({
        success: true,
        data: order,
        message: 'Pedido cancelado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/orders/stats
   * Retorna estatísticas de pedidos
   */
  async getStatistics(req, res) {
    try {
      const stats = await this.service.getOrderStatistics();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/orders/realtime-stats
   * Retorna estatísticas em tempo real (do Observer)
   */
  async getRealtimeStats(req, res) {
    try {
      const stats = this.service.getRealtimeStatistics();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/orders/audit-logs
   * Retorna logs de auditoria
   */
  async getAuditLogs(req, res) {
    try {
      const logs = this.service.getAuditLogs();
      
      res.status(200).json({
        success: true,
        data: logs,
        count: logs.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
