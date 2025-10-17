import { IObserver } from './IObserver.js';

/**
 * PADRÃO OBSERVER
 * 
 * Observador que envia notificações por email (simulado)
 */
export class EmailNotificationObserver extends IObserver {
  update(event) {
    switch (event.type) {
      case 'ORDER_CREATED':
        this.sendOrderCreatedEmail(event.data);
        break;
      case 'ORDER_STATUS_CHANGED':
        this.sendOrderStatusEmail(event.data);
        break;
      case 'ORDER_CANCELLED':
        this.sendOrderCancelledEmail(event.data);
        break;
      case 'PRODUCT_LOW_STOCK':
        this.sendLowStockEmail(event.data);
        break;
      default:
        console.log(`📧 Email: Evento não tratado: ${event.type}`);
    }
  }

  sendOrderCreatedEmail(order) {
    console.log(`📧 EMAIL enviado para ${order.customerName}:`);
    console.log(`   Assunto: Pedido #${order.id} confirmado!`);
    console.log(`   Conteúdo: Seu pedido no valor de R$${order.total.toFixed(2)} foi criado com sucesso.`);
  }

  sendOrderStatusEmail(data) {
    console.log(`📧 EMAIL enviado para cliente do pedido #${data.orderId}:`);
    console.log(`   Assunto: Status do pedido atualizado`);
    console.log(`   Conteúdo: Seu pedido mudou para: ${data.newStatus}`);
  }

  sendOrderCancelledEmail(order) {
    console.log(`📧 EMAIL enviado para ${order.customerName}:`);
    console.log(`   Assunto: Pedido #${order.id} cancelado`);
    console.log(`   Conteúdo: Seu pedido foi cancelado conforme solicitado.`);
  }

  sendLowStockEmail(product) {
    console.log(`📧 EMAIL enviado para administrador:`);
    console.log(`   Assunto: ALERTA - Estoque baixo`);
    console.log(`   Conteúdo: Produto "${product.name}" com apenas ${product.stock} unidades em estoque.`);
  }

  getName() {
    return 'EmailNotificationObserver';
  }
}

/**
 * Observador que registra logs de auditoria
 */
export class AuditLogObserver extends IObserver {
  constructor() {
    super();
    this.logs = [];
  }

  update(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: event.type,
      data: event.data,
      metadata: event.metadata || {}
    };

    this.logs.push(logEntry);
    console.log(`📝 AUDIT LOG registrado:`);
    console.log(`   Tipo: ${event.type}`);
    console.log(`   Timestamp: ${logEntry.timestamp}`);
    console.log(`   Dados: ${JSON.stringify(event.data, null, 2).substring(0, 100)}...`);
  }

  getName() {
    return 'AuditLogObserver';
  }

  getLogs() {
    return [...this.logs];
  }

  getLogsByType(type) {
    return this.logs.filter(log => log.type === type);
  }

  clearLogs() {
    this.logs = [];
    console.log('🗑️  Logs de auditoria limpos');
  }
}

/**
 * Observador que atualiza estatísticas em tempo real
 */
export class StatisticsObserver extends IObserver {
  constructor() {
    super();
    this.statistics = {
      ordersCreated: 0,
      ordersCompleted: 0,
      ordersCancelled: 0,
      totalRevenue: 0,
      lowStockAlerts: 0
    };
  }

  update(event) {
    switch (event.type) {
      case 'ORDER_CREATED':
        this.statistics.ordersCreated++;
        console.log(`📊 STATS: Total de pedidos criados: ${this.statistics.ordersCreated}`);
        break;

      case 'ORDER_STATUS_CHANGED':
        if (event.data.newStatus === 'COMPLETED') {
          this.statistics.ordersCompleted++;
          this.statistics.totalRevenue += event.data.order.total;
          console.log(`📊 STATS: Pedidos completos: ${this.statistics.ordersCompleted}`);
          console.log(`📊 STATS: Receita total: R$${this.statistics.totalRevenue.toFixed(2)}`);
        }
        break;

      case 'ORDER_CANCELLED':
        this.statistics.ordersCancelled++;
        console.log(`📊 STATS: Pedidos cancelados: ${this.statistics.ordersCancelled}`);
        break;

      case 'PRODUCT_LOW_STOCK':
        this.statistics.lowStockAlerts++;
        console.log(`📊 STATS: Alertas de estoque baixo: ${this.statistics.lowStockAlerts}`);
        break;
    }
  }

  getName() {
    return 'StatisticsObserver';
  }

  getStatistics() {
    return { ...this.statistics };
  }

  resetStatistics() {
    this.statistics = {
      ordersCreated: 0,
      ordersCompleted: 0,
      ordersCancelled: 0,
      totalRevenue: 0,
      lowStockAlerts: 0
    };
    console.log('🗑️  Estatísticas resetadas');
  }
}

/**
 * Observador que envia notificações push (simulado)
 */
export class PushNotificationObserver extends IObserver {
  update(event) {
    switch (event.type) {
      case 'ORDER_CREATED':
        this.sendPushNotification(
          'Pedido Confirmado! 🎉',
          `Seu pedido #${event.data.id} foi recebido e está sendo processado.`
        );
        break;

      case 'ORDER_STATUS_CHANGED':
        this.sendPushNotification(
          'Status Atualizado 📦',
          `Pedido #${event.data.orderId} agora está: ${event.data.newStatus}`
        );
        break;

      case 'ORDER_CANCELLED':
        this.sendPushNotification(
          'Pedido Cancelado ❌',
          `Seu pedido #${event.data.id} foi cancelado.`
        );
        break;
    }
  }

  sendPushNotification(title, message) {
    console.log(`📱 PUSH NOTIFICATION:`);
    console.log(`   Título: ${title}`);
    console.log(`   Mensagem: ${message}`);
  }

  getName() {
    return 'PushNotificationObserver';
  }
}
