import { ProductRepository } from '../repositories/ProductRepository.js';
import { OrderRepository } from '../repositories/OrderRepository.js';

/**
 * PADRÃO FACTORY METHOD
 * 
 * RepositoryFactory - Cria instâncias de repositórios de forma centralizada
 * 
 * Benefícios:
 * - Encapsula a lógica de criação de objetos complexos
 * - Facilita manutenção (mudanças na criação ficam centralizadas)
 * - Permite extensão fácil para novos tipos de repositórios
 * - Reduz acoplamento entre código cliente e classes concretas
 * - Possibilita cache de instâncias e controle de ciclo de vida
 */
export class RepositoryFactory {
  // Cache de instâncias de repositórios (padrão Singleton por tipo)
  static #instances = new Map();

  /**
   * Tipos de repositórios disponíveis
   */
  static TYPES = {
    PRODUCT: 'product',
    ORDER: 'order'
  };

  /**
   * Cria ou retorna instância de repositório baseado no tipo
   * @param {string} type - Tipo do repositório (use RepositoryFactory.TYPES)
   * @param {boolean} forceNew - Se true, cria nova instância mesmo que exista cache
   * @returns {IRepository} Instância do repositório solicitado
   */
  static createRepository(type, forceNew = false) {
    // Se não forçar nova instância e já existir no cache, retorna a existente
    if (!forceNew && this.#instances.has(type)) {
      console.log(`♻️  Retornando instância em cache: ${type}Repository`);
      return this.#instances.get(type);
    }

    let repository;

    // Factory Method: decide qual classe concreta instanciar
    switch (type) {
      case this.TYPES.PRODUCT:
        repository = new ProductRepository();
        console.log(`🏭 Factory criou: ProductRepository`);
        break;

      case this.TYPES.ORDER:
        repository = new OrderRepository();
        console.log(`🏭 Factory criou: OrderRepository`);
        break;

      default:
        throw new Error(`Tipo de repositório desconhecido: ${type}`);
    }

    // Armazena no cache
    this.#instances.set(type, repository);
    return repository;
  }

  /**
   * Cria um ProductRepository
   */
  static createProductRepository(forceNew = false) {
    return this.createRepository(this.TYPES.PRODUCT, forceNew);
  }

  /**
   * Cria um OrderRepository
   */
  static createOrderRepository(forceNew = false) {
    return this.createRepository(this.TYPES.ORDER, forceNew);
  }

  /**
   * Limpa o cache de instâncias
   * Útil para testes ou quando precisa forçar recriação
   */
  static clearCache() {
    this.#instances.clear();
    console.log('🗑️  Cache de repositórios limpo');
  }

  /**
   * Retorna todos os repositórios em cache
   */
  static getCachedRepositories() {
    return Array.from(this.#instances.keys());
  }

  /**
   * Verifica se um tipo de repositório está em cache
   */
  static isCached(type) {
    return this.#instances.has(type);
  }

  /**
   * Remove um repositório específico do cache
   */
  static removeCached(type) {
    const removed = this.#instances.delete(type);
    if (removed) {
      console.log(`🗑️  Repositório removido do cache: ${type}`);
    }
    return removed;
  }
}

// Congela a classe para prevenir modificações
Object.freeze(RepositoryFactory);
