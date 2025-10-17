/**
 * PADRÃO OBSERVER
 * 
 * Interface para observadores (listeners)
 * Observadores são notificados quando eventos ocorrem
 */
export class IObserver {
  /**
   * Método chamado quando evento ocorre
   * @param {Object} event - Dados do evento
   */
  update(event) {
    throw new Error('Método update() deve ser implementado');
  }

  /**
   * Retorna o nome do observador
   */
  getName() {
    throw new Error('Método getName() deve ser implementado');
  }
}
