/**
 * Entidade OrderItem (Item do Pedido)
 */
export class OrderItem {
  constructor(product, quantity, unitPrice) {
    this.product = product;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
  }

  /**
   * Calcula o subtotal do item
   */
  getSubtotal() {
    return this.quantity * this.unitPrice;
  }

  toJSON() {
    return {
      productId: this.product.id,
      productName: this.product.name,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      subtotal: this.getSubtotal()
    };
  }
}

/**
 * Entidade Order (Pedido)
 * Representa um pedido no sistema
 */
export class Order {
  static STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
  };

  constructor(id, customerId, customerName) {
    this.id = id;
    this.customerId = customerId;
    this.customerName = customerName;
    this.items = [];
    this.status = Order.STATUS.PENDING;
    this.subtotal = 0;
    this.discount = 0;
    this.total = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Adiciona um item ao pedido
   */
  addItem(product, quantity) {
    const item = new OrderItem(product, quantity, product.price);
    this.items.push(item);
    this.recalculateTotal();
    this.updatedAt = new Date();
  }

  /**
   * Remove um item do pedido
   */
  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.recalculateTotal();
    this.updatedAt = new Date();
  }

  /**
   * Aplica desconto ao pedido
   */
  applyDiscount(discountAmount) {
    this.discount = discountAmount;
    this.recalculateTotal();
    this.updatedAt = new Date();
  }

  /**
   * Recalcula o total do pedido
   */
  recalculateTotal() {
    this.subtotal = this.items.reduce((sum, item) => sum + item.getSubtotal(), 0);
    this.total = Math.max(0, this.subtotal - this.discount);
  }

  /**
   * Atualiza o status do pedido
   */
  updateStatus(newStatus) {
    if (!Object.values(Order.STATUS).includes(newStatus)) {
      throw new Error(`Status inválido: ${newStatus}`);
    }
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  /**
   * Verifica se o pedido pode ser cancelado
   */
  canBeCancelled() {
    return this.status === Order.STATUS.PENDING || this.status === Order.STATUS.PROCESSING;
  }

  /**
   * Cancela o pedido
   */
  cancel() {
    if (!this.canBeCancelled()) {
      throw new Error(`Pedido não pode ser cancelado no status: ${this.status}`);
    }
    this.status = Order.STATUS.CANCELLED;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      customerId: this.customerId,
      customerName: this.customerName,
      items: this.items.map(item => item.toJSON()),
      status: this.status,
      subtotal: this.subtotal,
      discount: this.discount,
      total: this.total,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
