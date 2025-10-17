/**
 * PADRÃO OBSERVER
 * 
 * Subject (Observable) - Gerencia lista de observadores e notifica mudanças
 */
export class EventSubject {
  constructor() {
    this.observers = [];
  }

  /**
   * Registra um observador
   */
  attach(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      console.log(`👀 Observador registrado: ${observer.getName()}`);
    }
  }

  /**
   * Remove um observador
   */
  detach(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      console.log(`👋 Observador removido: ${observer.getName()}`);
    }
  }

  /**
   * Notifica todos os observadores sobre um evento
   */
  notify(event) {
    console.log(`📢 Notificando ${this.observers.length} observadores sobre: ${event.type}`);
    this.observers.forEach(observer => {
      try {
        observer.update(event);
      } catch (error) {
        console.error(`❌ Erro ao notificar ${observer.getName()}:`, error.message);
      }
    });
  }

  /**
   * Retorna quantidade de observadores registrados
   */
  getObserversCount() {
    return this.observers.length;
  }

  /**
   * Remove todos os observadores
   */
  clearObservers() {
    this.observers = [];
    console.log('🗑️  Todos os observadores removidos');
  }
}
