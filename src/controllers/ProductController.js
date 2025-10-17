import { ProductService } from '../services/ProductService.js';

/**
 * ProductController - Controlador REST para produtos
 * Recebe requisições HTTP e delega para o Service
 */
export class ProductController {
  constructor() {
    this.service = new ProductService();
  }

  /**
   * GET /api/products
   * Lista todos os produtos
   */
  async getAll(req, res) {
    try {
      const products = await this.service.getAllProducts();
      res.status(200).json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/products/:id
   * Busca produto por ID
   */
  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const product = await this.service.getProductById(id);
      
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/products
   * Cria novo produto
   */
  async create(req, res) {
    try {
      const product = await this.service.createProduct(req.body);
      
      res.status(201).json({
        success: true,
        data: product,
        message: 'Produto criado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * PUT /api/products/:id
   * Atualiza produto
   */
  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const product = await this.service.updateProduct(id, req.body);
      
      res.status(200).json({
        success: true,
        data: product,
        message: 'Produto atualizado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/products/:id
   * Deleta produto
   */
  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      await this.service.deleteProduct(id);
      
      res.status(200).json({
        success: true,
        message: 'Produto deletado com sucesso'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/products/category/:category
   * Busca produtos por categoria
   */
  async getByCategory(req, res) {
    try {
      const category = req.params.category;
      const products = await this.service.getProductsByCategory(category);
      
      res.status(200).json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/products/search?name=...
   * Busca produtos por nome
   */
  async search(req, res) {
    try {
      const name = req.query.name;
      
      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Parâmetro "name" é obrigatório'
        });
      }

      const products = await this.service.searchProductsByName(name);
      
      res.status(200).json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/products/stats
   * Retorna estatísticas de produtos
   */
  async getStatistics(req, res) {
    try {
      const stats = await this.service.getProductStatistics();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/products/low-stock
   * Lista produtos com estoque baixo
   */
  async getLowStock(req, res) {
    try {
      const threshold = parseInt(req.query.threshold) || 10;
      const products = await this.service.getLowStockProducts(threshold);
      
      res.status(200).json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
