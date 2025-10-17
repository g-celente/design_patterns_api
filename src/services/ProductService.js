import { Product } from '../models/Product.js';
import { RepositoryFactory } from '../factories/RepositoryFactory.js';
import { ProductValidationStrategy, ProductUpdateValidationStrategy } from '../strategies/ValidationStrategies.js';

/**
 * ProductService - Camada de lógica de negócio para produtos
 * 
 * Responsabilidades:
 * - Validação de dados usando Strategy
 * - Regras de negócio
 * - Coordenação com Repository
 */
export class ProductService {
  constructor() {
    this.repository = RepositoryFactory.createProductRepository();
    this.createValidator = new ProductValidationStrategy();
    this.updateValidator = new ProductUpdateValidationStrategy();
  }

  /**
   * Cria um novo produto
   */
  async createProduct(productData) {
    // Validar dados usando Strategy
    const validation = this.createValidator.validate(productData);
    
    if (!validation.isValid) {
      throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
    }

    // Verificar se já existe produto com mesmo nome
    const exists = await this.repository.existsByName(productData.name);
    if (exists) {
      throw new Error(`Já existe um produto com o nome: ${productData.name}`);
    }

    // Criar produto
    const product = new Product(
      null, // ID será gerado
      productData.name,
      productData.description || '',
      productData.price,
      productData.stock,
      productData.category
    );

    return await this.repository.create(product);
  }

  /**
   * Busca produto por ID
   */
  async getProductById(id) {
    const product = await this.repository.findById(id);
    
    if (!product) {
      throw new Error(`Produto com ID ${id} não encontrado`);
    }

    return product;
  }

  /**
   * Lista todos os produtos
   */
  async getAllProducts() {
    return await this.repository.findAll();
  }

  /**
   * Busca produtos por categoria
   */
  async getProductsByCategory(category) {
    return await this.repository.findByCategory(category);
  }

  /**
   * Busca produtos por nome
   */
  async searchProductsByName(name) {
    return await this.repository.findByName(name);
  }

  /**
   * Atualiza produto
   */
  async updateProduct(id, updateData) {
    // Validar dados de atualização usando Strategy
    const validation = this.updateValidator.validate(updateData);
    
    if (!validation.isValid) {
      throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
    }

    // Verificar se produto existe
    const product = await this.getProductById(id);

    // Se está alterando nome, verificar duplicação
    if (updateData.name && updateData.name !== product.name) {
      const exists = await this.repository.existsByName(updateData.name);
      if (exists) {
        throw new Error(`Já existe um produto com o nome: ${updateData.name}`);
      }
    }

    return await this.repository.update(id, updateData);
  }

  /**
   * Deleta produto
   */
  async deleteProduct(id) {
    // Verificar se produto existe
    await this.getProductById(id);

    // Aqui poderia adicionar regra: não deletar se houver pedidos pendentes
    // Por simplicidade, apenas deleta
    return await this.repository.delete(id);
  }

  /**
   * Lista produtos com estoque baixo
   */
  async getLowStockProducts(threshold = 10) {
    return await this.repository.findLowStock(threshold);
  }

  /**
   * Retorna estatísticas de produtos
   */
  async getProductStatistics() {
    const products = await this.repository.findAll();
    
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length;

    // Categorias
    const categories = {};
    products.forEach(p => {
      if (!categories[p.category]) {
        categories[p.category] = 0;
      }
      categories[p.category]++;
    });

    return {
      totalProducts,
      totalValue,
      outOfStock,
      lowStock,
      categories
    };
  }
}
