/**
 * PADRÃO STRATEGY
 * 
 * Interface base para estratégias de desconto
 * Define o contrato que todas as estratégias devem seguir
 */
export class IDiscountStrategy {
  /**
   * Calcula o desconto baseado no valor do pedido
   * @param {number} orderTotal - Valor total do pedido
   * @returns {number} Valor do desconto
   */
  calculate(orderTotal) {
    throw new Error('Método calculate() deve ser implementado');
  }

  /**
   * Retorna descrição da estratégia
   */
  getDescription() {
    throw new Error('Método getDescription() deve ser implementado');
  }
}
