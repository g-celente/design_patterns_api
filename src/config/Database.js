/**
 * PADRÃO SINGLETON
 * 
 * Garante que apenas uma instância da classe Database exista em toda a aplicação.
 * Isso é crucial para gerenciar uma única conexão/estado do banco de dados.
 * 
 * Benefícios:
 * - Controle de acesso à instância única
 * - Reduz uso de memória (uma única instância)
 * - Ponto global de acesso aos dados
 * - Facilita sincronização e controle de concorrência
 */
export class Database {
  // Instância única (privada)
  static #instance = null;

  // Armazenamento em memória (simula um banco de dados)
  #data = {
    products: new Map(),
    orders: new Map(),
    counters: {
      products: 0,
      orders: 0
    }
  };

  /**
   * Construtor privado - impede instanciação direta
   * Apenas o método getInstance() pode criar a instância
   */
  constructor() {
    if (Database.#instance) {
      throw new Error('Use Database.getInstance() para obter a instância');
    }
    
    console.log('📦 Database Singleton criado');
    this.initializeMockData();
  }

  /**
   * Método estático que retorna a instância única
   * Se não existir, cria uma nova; caso contrário, retorna a existente
   */
  static getInstance() {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }

  /**
   * Inicializa dados mockados para teste
   */
  initializeMockData() {
    console.log('🔧 Inicializando dados mockados...');
    // Dados iniciais serão criados via API
  }

  /**
   * Obtém a coleção de produtos
   */
  getProductsCollection() {
    return this.#data.products;
  }

  /**
   * Obtém a coleção de pedidos
   */
  getOrdersCollection() {
    return this.#data.orders;
  }

  /**
   * Gera próximo ID para produtos
   */
  getNextProductId() {
    return ++this.#data.counters.products;
  }

  /**
   * Gera próximo ID para pedidos
   */
  getNextOrderId() {
    return ++this.#data.counters.orders;
  }

  /**
   * Limpa todos os dados (útil para testes)
   */
  clearAll() {
    this.#data.products.clear();
    this.#data.orders.clear();
    this.#data.counters.products = 0;
    this.#data.counters.orders = 0;
    console.log('🗑️  Database limpo');
  }

  /**
   * Retorna estatísticas do banco de dados
   */
  getStats() {
    return {
      totalProducts: this.#data.products.size,
      totalOrders: this.#data.orders.size,
      counters: { ...this.#data.counters }
    };
  }

  /**
   * Simula conexão com banco de dados
   */
  async connect() {
    console.log('🔌 Conectando ao banco de dados...');
    // Simulação de conexão
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Conectado ao banco de dados');
        resolve(true);
      }, 100);
    });
  }

  /**
   * Simula desconexão do banco de dados
   */
  async disconnect() {
    console.log('🔌 Desconectando do banco de dados...');
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Desconectado do banco de dados');
        resolve(true);
      }, 100);
    });
  }
}

// Congela o construtor para prevenir modificações
Object.freeze(Database);
