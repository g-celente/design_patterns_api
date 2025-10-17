import { Order } from '../models/Order.js';
import { RepositoryFactory } from '../factories/RepositoryFactory.js';
import { EventSubject } from '../observers/EventSubject.js';
import { NoDiscountStrategy } from '../strategies/DiscountStrategies.js';

/**
 * PADRÃO FACADE
 * 
 * OrderFacade - Fornece interface simplificada para operações complexas de pedidos
 * 
 * Benefícios:
 * - Simplifica interações complexas entre múltiplos subsistemas
 * - Reduz acoplamento entre cliente e subsistemas internos
 * - Fornece API mais fácil de usar e entender
 * - Centraliza lógica de orquestração complexa
 * - Facilita manutenção ao isolar complexidade
 * 
 * Esta facade coordena:
 * - Repository (persistência)
 * - Strategy (descontos)
 * - Observer (notificações)
 * - Validação de estoque
 * - Cálculos de totais
 */
export class OrderFacade {
  constructor() {
    this.orderRepository = RepositoryFactory.createOrderRepository();
    this.productRepository = RepositoryFactory.createProductRepository();
    this.eventSubject = new EventSubject();
    this.discountStrategy = new NoDiscountStrategy();
  }

  /**
   * Registra observadores para eventos de pedido
   */
  attachObserver(observer) {
    this.eventSubject.attach(observer);
  }

  /**
   * Define estratégia de desconto
   */
  setDiscountStrategy(strategy) {
    this.discountStrategy = strategy;
    console.log(`💰 Estratégia de desconto definida: ${strategy.getDescription()}`);
  }

  /**
   * Método Facade: Cria pedido completo com validações e notificações
   * 
   * Orquestra múltiplas operações:
   * 1. Valida dados do pedido
   * 2. Verifica disponibilidade de estoque
   * 3. Cria objeto Order
   * 4. Adiciona produtos ao pedido
   * 5. Reduz estoque dos produtos
   * 6. Aplica desconto usando Strategy
   * 7. Persiste no Repository
   * 8. Notifica Observers
   */
  async createOrder(orderData) {
    console.log('\n🎯 FACADE: Criando pedido completo...');

    try {
      // 1. Validar dados básicos
      if (!orderData.customerId || !orderData.customerName) {
        throw new Error('Dados do cliente são obrigatórios');
      }

      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Pedido deve conter pelo menos um item');
      }

      // 2. Criar instância do pedido
      const order = new Order(
        null, // ID será gerado pelo repository
        orderData.customerId,
        orderData.customerName
      );

      // 3. Processar cada item do pedido
      for (const item of orderData.items) {
        const product = await this.productRepository.findById(item.productId);
        
        if (!product) {
          throw new Error(`Produto ${item.productId} não encontrado`);
        }

        // Verificar estoque
        if (!product.hasStock(item.quantity)) {
          throw new Error(
            `Estoque insuficiente para ${product.name}. ` +
            `Disponível: ${product.stock}, Solicitado: ${item.quantity}`
          );
        }

        // Adicionar item ao pedido
        order.addItem(product, item.quantity);

        // Reduzir estoque
        product.reduceStock(item.quantity);
        await this.productRepository.update(product.id, product);

        // Verificar se estoque ficou baixo
        if (product.stock < 10) {
          this.eventSubject.notify({
            type: 'PRODUCT_LOW_STOCK',
            data: product.toJSON()
          });
        }
      }

      // 4. Aplicar desconto usando Strategy
      const discount = this.discountStrategy.calculate(order.subtotal);
      order.applyDiscount(discount);

      console.log(`   Subtotal: R$${order.subtotal.toFixed(2)}`);
      console.log(`   Desconto: R$${order.discount.toFixed(2)} (${this.discountStrategy.getDescription()})`);
      console.log(`   Total: R$${order.total.toFixed(2)}`);

      // 5. Persistir pedido
      const savedOrder = await this.orderRepository.create(order);

      // 6. Notificar observers
      this.eventSubject.notify({
        type: 'ORDER_CREATED',
        data: savedOrder.toJSON()
      });

      console.log('✅ FACADE: Pedido criado com sucesso!\n');
      return savedOrder;

    } catch (error) {
      console.error('❌ FACADE: Erro ao criar pedido:', error.message);
      throw error;
    }
  }

  /**
   * Método Facade: Atualiza status do pedido com validações
   */
  async updateOrderStatus(orderId, newStatus) {
    console.log(`\n🎯 FACADE: Atualizando status do pedido ${orderId}...`);

    try {
      const order = await this.orderRepository.findById(orderId);
      
      if (!order) {
        throw new Error(`Pedido ${orderId} não encontrado`);
      }

      const oldStatus = order.status;
      order.updateStatus(newStatus);
      await this.orderRepository.update(orderId, order);

      // Notificar mudança de status
      this.eventSubject.notify({
        type: 'ORDER_STATUS_CHANGED',
        data: {
          orderId,
          oldStatus,
          newStatus,
          order: order.toJSON()
        }
      });

      console.log(`✅ FACADE: Status atualizado: ${oldStatus} → ${newStatus}\n`);
      return order;

    } catch (error) {
      console.error('❌ FACADE: Erro ao atualizar status:', error.message);
      throw error;
    }
  }

  /**
   * Método Facade: Cancela pedido e restaura estoque
   */
  async cancelOrder(orderId) {
    console.log(`\n🎯 FACADE: Cancelando pedido ${orderId}...`);

    try {
      const order = await this.orderRepository.findById(orderId);
      
      if (!order) {
        throw new Error(`Pedido ${orderId} não encontrado`);
      }

      // Verificar se pode cancelar
      if (!order.canBeCancelled()) {
        throw new Error(`Pedido não pode ser cancelado no status: ${order.status}`);
      }

      // Restaurar estoque dos produtos
      for (const item of order.items) {
        const product = await this.productRepository.findById(item.product.id);
        if (product) {
          product.increaseStock(item.quantity);
          await this.productRepository.update(product.id, product);
          console.log(`   ↩️  Estoque restaurado: ${product.name} +${item.quantity}`);
        }
      }

      // Cancelar pedido
      order.cancel();
      await this.orderRepository.update(orderId, order);

      // Notificar cancelamento
      this.eventSubject.notify({
        type: 'ORDER_CANCELLED',
        data: order.toJSON()
      });

      console.log('✅ FACADE: Pedido cancelado com sucesso!\n');
      return order;

    } catch (error) {
      console.error('❌ FACADE: Erro ao cancelar pedido:', error.message);
      throw error;
    }
  }

  /**
   * Método Facade: Busca pedido com detalhes completos
   */
  async getOrderDetails(orderId) {
    const order = await this.orderRepository.findById(orderId);
    
    if (!order) {
      throw new Error(`Pedido ${orderId} não encontrado`);
    }

    return {
      ...order.toJSON(),
      discountStrategy: this.discountStrategy.getDescription()
    };
  }

  /**
   * Método Facade: Lista todos os pedidos
   */
  async getAllOrders() {
    return await this.orderRepository.findAll();
  }

  /**
   * Método Facade: Obtém estatísticas de pedidos
   */
  async getOrderStatistics() {
    return await this.orderRepository.getStatistics();
  }
}
