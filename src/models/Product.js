/**
 * Entidade Product (Produto)
 * Representa um produto no sistema
 */
export class Product {
  constructor(id, name, description, price, stock, category) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Atualiza os dados do produto
   */
  update(data) {
    if (data.name) this.name = data.name;
    if (data.description) this.description = data.description;
    if (data.price) this.price = data.price;
    if (data.stock !== undefined) this.stock = data.stock;
    if (data.category) this.category = data.category;
    this.updatedAt = new Date();
  }

  /**
   * Verifica se há estoque disponível
   */
  hasStock(quantity) {
    return this.stock >= quantity;
  }

  /**
   * Reduz o estoque
   */
  reduceStock(quantity) {
    if (!this.hasStock(quantity)) {
      throw new Error(`Estoque insuficiente para o produto ${this.name}`);
    }
    this.stock -= quantity;
    this.updatedAt = new Date();
  }

  /**
   * Aumenta o estoque
   */
  increaseStock(quantity) {
    this.stock += quantity;
    this.updatedAt = new Date();
  }

  /**
   * Converte para objeto simples
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      category: this.category,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
