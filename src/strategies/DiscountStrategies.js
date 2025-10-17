import { IDiscountStrategy } from './IDiscountStrategy.js';

/**
 * PADRÃO STRATEGY
 * 
 * Estratégia: Nenhum desconto
 */
export class NoDiscountStrategy extends IDiscountStrategy {
  calculate(orderTotal) {
    return 0;
  }

  getDescription() {
    return 'Sem desconto';
  }
}

/**
 * Estratégia: Desconto percentual fixo
 */
export class PercentageDiscountStrategy extends IDiscountStrategy {
  constructor(percentage) {
    super();
    if (percentage < 0 || percentage > 100) {
      throw new Error('Percentual deve estar entre 0 e 100');
    }
    this.percentage = percentage;
  }

  calculate(orderTotal) {
    return (orderTotal * this.percentage) / 100;
  }

  getDescription() {
    return `${this.percentage}% de desconto`;
  }
}

/**
 * Estratégia: Desconto valor fixo
 */
export class FixedAmountDiscountStrategy extends IDiscountStrategy {
  constructor(amount) {
    super();
    if (amount < 0) {
      throw new Error('Valor do desconto deve ser positivo');
    }
    this.amount = amount;
  }

  calculate(orderTotal) {
    // Desconto não pode ser maior que o total do pedido
    return Math.min(this.amount, orderTotal);
  }

  getDescription() {
    return `R$ ${this.amount.toFixed(2)} de desconto`;
  }
}

/**
 * Estratégia: Desconto progressivo por faixa de valor
 */
export class TieredDiscountStrategy extends IDiscountStrategy {
  constructor() {
    super();
    this.tiers = [
      { minValue: 1000, percentage: 15 },
      { minValue: 500, percentage: 10 },
      { minValue: 200, percentage: 5 },
      { minValue: 0, percentage: 0 }
    ];
  }

  calculate(orderTotal) {
    // Encontra a faixa adequada
    const tier = this.tiers.find(t => orderTotal >= t.minValue);
    return (orderTotal * tier.percentage) / 100;
  }

  getDescription() {
    return 'Desconto progressivo: 5% (R$200+), 10% (R$500+), 15% (R$1000+)';
  }
}

/**
 * Estratégia: Desconto para primeira compra
 */
export class FirstOrderDiscountStrategy extends IDiscountStrategy {
  constructor(percentage = 20) {
    super();
    this.percentage = percentage;
  }

  calculate(orderTotal) {
    return (orderTotal * this.percentage) / 100;
  }

  getDescription() {
    return `${this.percentage}% de desconto para primeira compra`;
  }
}

/**
 * Estratégia: Desconto Black Friday (agressivo)
 */
export class BlackFridayDiscountStrategy extends IDiscountStrategy {
  calculate(orderTotal) {
    // Black Friday: 30% de desconto em tudo
    return (orderTotal * 30) / 100;
  }

  getDescription() {
    return '🔥 BLACK FRIDAY: 30% OFF em tudo!';
  }
}

/**
 * Estratégia: Cupom de desconto
 */
export class CouponDiscountStrategy extends IDiscountStrategy {
  constructor(couponCode, discountPercentage, minOrderValue = 0) {
    super();
    this.couponCode = couponCode;
    this.discountPercentage = discountPercentage;
    this.minOrderValue = minOrderValue;
  }

  calculate(orderTotal) {
    if (orderTotal < this.minOrderValue) {
      return 0;
    }
    return (orderTotal * this.discountPercentage) / 100;
  }

  getDescription() {
    if (this.minOrderValue > 0) {
      return `Cupom ${this.couponCode}: ${this.discountPercentage}% (mínimo R$${this.minOrderValue})`;
    }
    return `Cupom ${this.couponCode}: ${this.discountPercentage}% de desconto`;
  }

  getCouponCode() {
    return this.couponCode;
  }
}
