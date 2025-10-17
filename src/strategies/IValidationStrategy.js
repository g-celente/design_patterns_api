/**
 * PADRÃO STRATEGY
 * 
 * Interface base para estratégias de validação
 */
export class IValidationStrategy {
  /**
   * Valida os dados
   * @param {*} data - Dados a serem validados
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate(data) {
    throw new Error('Método validate() deve ser implementado');
  }
}
