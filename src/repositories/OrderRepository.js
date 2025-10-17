import { IRepository } from './IRepository.js';
import { Database } from '../config/Database.js';
import { Order } from '../models/Order.js';

/**
 * PADRÃO REPOSITORY
 * 
 * OrderRepository - Responsável por todas as operações de persistência de pedidos
 */
export class OrderRepository extends IRepository {
  constructor() {
    super();
    this.db = Database.getInstance();
    this.collection = this.db.getOrdersCollection();
  }

  /**
   * Retorna todos os pedidos
   */
  async findAll() {
    return Array.from(this.collection.values());
  }

  /**
   * Busca pedido por ID
   */
  async findById(id) {
    const order = this.collection.get(id);
    if (!order) {
      return null;
    }
    return order;
  }

  /**
   * Busca pedidos por cliente
   */
  async findByCustomerId(customerId) {
    const orders = await this.findAll();
    return orders.filter(o => o.customerId === customerId);
  }

  /**
   * Busca pedidos por status
   */
  async findByStatus(status) {
    const orders = await this.findAll();
    return orders.filter(o => o.status === status);
  }

  /**
   * Busca pedidos pendentes
   */
  async findPending() {
    return this.findByStatus(Order.STATUS.PENDING);
  }

  /**
   * Busca pedidos em processamento
   */
  async findProcessing() {
    return this.findByStatus(Order.STATUS.PROCESSING);
  }

  /**
   * Busca pedidos completos
   */
  async findCompleted() {
    return this.findByStatus(Order.STATUS.COMPLETED);
  }

  /**
   * Cria um novo pedido
   */
  async create(order) {
    const id = this.db.getNextOrderId();
    order.id = id;
    this.collection.set(id, order);
    console.log(`✅ Pedido criado: ${order.customerName} (ID: ${id})`);
    return order;
  }

  /**
   * Atualiza um pedido existente
   */
  async update(id, order) {
    const existingOrder = await this.findById(id);
    if (!existingOrder) {
      throw new Error(`Pedido com ID ${id} não encontrado`);
    }
    
    this.collection.set(id, order);
    console.log(`✅ Pedido atualizado: ID ${id}`);
    return order;
  }

  /**
   * Deleta um pedido (cancelamento)
   */
  async delete(id) {
    const order = await this.findById(id);
    if (!order) {
      throw new Error(`Pedido com ID ${id} não encontrado`);
    }
    
    this.collection.delete(id);
    console.log(`🗑️  Pedido deletado: ID ${id}`);
    return true;
  }

  /**
   * Retorna contagem total de pedidos
   */
  async count() {
    return this.collection.size;
  }

  /**
   * Calcula valor total de vendas
   */
  async getTotalSales() {
    const orders = await this.findAll();
    return orders
      .filter(o => o.status === Order.STATUS.COMPLETED)
      .reduce((sum, order) => sum + order.total, 0);
  }

  /**
   * Retorna estatísticas de pedidos
   */
  async getStatistics() {
    const orders = await this.findAll();
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === Order.STATUS.PENDING).length,
      processing: orders.filter(o => o.status === Order.STATUS.PROCESSING).length,
      completed: orders.filter(o => o.status === Order.STATUS.COMPLETED).length,
      cancelled: orders.filter(o => o.status === Order.STATUS.CANCELLED).length,
      totalSales: await this.getTotalSales()
    };
  }
}
