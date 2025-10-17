import { IRepository } from './IRepository.js';
import { Database } from '../config/Database.js';

/**
 * PADRÃO REPOSITORY
 * 
 * ProductRepository - Responsável por todas as operações de persistência de produtos
 * 
 * Benefícios:
 * - Separa lógica de negócio da lógica de persistência
 * - Facilita troca de fonte de dados (memória, SQL, NoSQL, etc)
 * - Permite testar lógica de negócio sem depender do banco
 * - Centraliza queries e operações de dados
 */
export class ProductRepository extends IRepository {
  constructor() {
    super();
    this.db = Database.getInstance();
    this.collection = this.db.getProductsCollection();
  }

  /**
   * Retorna todos os produtos
   */
  async findAll() {
    return Array.from(this.collection.values());
  }

  /**
   * Busca produto por ID
   */
  async findById(id) {
    const product = this.collection.get(id);
    if (!product) {
      return null;
    }
    return product;
  }

  /**
   * Busca produtos por categoria
   */
  async findByCategory(category) {
    const products = await this.findAll();
    return products.filter(p => p.category === category);
  }

  /**
   * Busca produtos com estoque baixo
   */
  async findLowStock(threshold = 10) {
    const products = await this.findAll();
    return products.filter(p => p.stock < threshold);
  }

  /**
   * Busca produtos por nome (busca parcial)
   */
  async findByName(name) {
    const products = await this.findAll();
    return products.filter(p => 
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  /**
   * Cria um novo produto
   */
  async create(product) {
    const id = this.db.getNextProductId();
    product.id = id;
    this.collection.set(id, product);
    console.log(`✅ Produto criado: ${product.name} (ID: ${id})`);
    return product;
  }

  /**
   * Atualiza um produto existente
   */
  async update(id, updatedData) {
    const product = await this.findById(id);
    if (!product) {
      throw new Error(`Produto com ID ${id} não encontrado`);
    }
    
    product.update(updatedData);
    this.collection.set(id, product);
    console.log(`✅ Produto atualizado: ${product.name} (ID: ${id})`);
    return product;
  }

  /**
   * Deleta um produto
   */
  async delete(id) {
    const product = await this.findById(id);
    if (!product) {
      throw new Error(`Produto com ID ${id} não encontrado`);
    }
    
    this.collection.delete(id);
    console.log(`🗑️  Produto deletado: ${product.name} (ID: ${id})`);
    return true;
  }

  /**
   * Verifica se existe produto com o nome
   */
  async existsByName(name) {
    const products = await this.findAll();
    return products.some(p => p.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * Retorna contagem total de produtos
   */
  async count() {
    return this.collection.size;
  }
}
