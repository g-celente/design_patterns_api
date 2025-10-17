import { OrderFacade } from '../facades/OrderFacade.js';
import { OrderValidationStrategy } from '../strategies/ValidationStrategies.js';
import { 
  EmailNotificationObserver, 
  AuditLogObserver, 
  StatisticsObserver,
  PushNotificationObserver 
} from '../observers/ConcreteObservers.js';

/**
 * OrderService - Camada de lógica de negócio para pedidos
 * 
 * Utiliza OrderFacade para simplificar operações complexas
 */
export class OrderService {
  constructor() {
    this.orderFacade = new OrderFacade();
    this.validator = new OrderValidationStrategy();
    
    // Configurar observadores
    this.setupObservers();
  }

  /**
   * Configura observadores para eventos de pedido
   */
  setupObservers() {
    const emailObserver = new EmailNotificationObserver();
    const auditObserver = new AuditLogObserver();
    const statsObserver = new StatisticsObserver();
    const pushObserver = new PushNotificationObserver();

    this.orderFacade.attachObserver(emailObserver);
    this.orderFacade.attachObserver(auditObserver);
    this.orderFacade.attachObserver(statsObserver);
    this.orderFacade.attachObserver(pushObserver);

    // Guardar referências para acessar dados depois
    this.auditObserver = auditObserver;
    this.statsObserver = statsObserver;
  }

  /**
   * Define estratégia de desconto
   */
  setDiscountStrategy(strategy) {
    this.orderFacade.setDiscountStrategy(strategy);
  }

  /**
   * Cria um novo pedido
   */
  async createOrder(orderData) {
    // Validar dados usando Strategy
    const validation = this.validator.validate(orderData);
    
    if (!validation.isValid) {
      throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
    }

    // Usar Facade para criar pedido (simplifica operação complexa)
    return await this.orderFacade.createOrder(orderData);
  }

  /**
   * Busca pedido por ID
   */
  async getOrderById(id) {
    return await this.orderFacade.getOrderDetails(id);
  }

  /**
   * Lista todos os pedidos
   */
  async getAllOrders() {
    return await this.orderFacade.getAllOrders();
  }

  /**
   * Atualiza status do pedido
   */
  async updateOrderStatus(id, newStatus) {
    return await this.orderFacade.updateOrderStatus(id, newStatus);
  }

  /**
   * Cancela pedido
   */
  async cancelOrder(id) {
    return await this.orderFacade.cancelOrder(id);
  }

  /**
   * Obtém estatísticas de pedidos
   */
  async getOrderStatistics() {
    return await this.orderFacade.getOrderStatistics();
  }

  /**
   * Obtém logs de auditoria
   */
  getAuditLogs() {
    return this.auditObserver.getLogs();
  }

  /**
   * Obtém estatísticas em tempo real
   */
  getRealtimeStatistics() {
    return this.statsObserver.getStatistics();
  }
}
