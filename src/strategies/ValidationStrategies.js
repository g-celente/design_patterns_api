import { IValidationStrategy } from './IValidationStrategy.js';

/**
 * PADRÃO STRATEGY
 * 
 * Estratégia de validação para produtos
 */
export class ProductValidationStrategy extends IValidationStrategy {
  validate(productData) {
    const errors = [];

    // Validação do nome
    if (!productData.name || productData.name.trim().length === 0) {
      errors.push('Nome do produto é obrigatório');
    } else if (productData.name.length < 3) {
      errors.push('Nome do produto deve ter no mínimo 3 caracteres');
    } else if (productData.name.length > 100) {
      errors.push('Nome do produto deve ter no máximo 100 caracteres');
    }

    // Validação do preço
    if (productData.price === undefined || productData.price === null) {
      errors.push('Preço é obrigatório');
    } else if (typeof productData.price !== 'number') {
      errors.push('Preço deve ser um número');
    } else if (productData.price < 0) {
      errors.push('Preço não pode ser negativo');
    } else if (productData.price === 0) {
      errors.push('Preço deve ser maior que zero');
    }

    // Validação do estoque
    if (productData.stock === undefined || productData.stock === null) {
      errors.push('Estoque é obrigatório');
    } else if (!Number.isInteger(productData.stock)) {
      errors.push('Estoque deve ser um número inteiro');
    } else if (productData.stock < 0) {
      errors.push('Estoque não pode ser negativo');
    }

    // Validação da categoria
    if (!productData.category || productData.category.trim().length === 0) {
      errors.push('Categoria é obrigatória');
    }

    // Validação da descrição (opcional, mas se fornecida deve ter tamanho adequado)
    if (productData.description && productData.description.length > 500) {
      errors.push('Descrição deve ter no máximo 500 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Estratégia de validação para pedidos
 */
export class OrderValidationStrategy extends IValidationStrategy {
  validate(orderData) {
    const errors = [];

    // Validação do ID do cliente
    if (!orderData.customerId) {
      errors.push('ID do cliente é obrigatório');
    }

    // Validação do nome do cliente
    if (!orderData.customerName || orderData.customerName.trim().length === 0) {
      errors.push('Nome do cliente é obrigatório');
    } else if (orderData.customerName.length < 3) {
      errors.push('Nome do cliente deve ter no mínimo 3 caracteres');
    }

    // Validação dos itens
    if (!orderData.items || !Array.isArray(orderData.items)) {
      errors.push('Itens do pedido são obrigatórios');
    } else if (orderData.items.length === 0) {
      errors.push('Pedido deve conter pelo menos um item');
    } else {
      // Valida cada item
      orderData.items.forEach((item, index) => {
        if (!item.productId) {
          errors.push(`Item ${index + 1}: ID do produto é obrigatório`);
        }
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Item ${index + 1}: Quantidade deve ser maior que zero`);
        }
        if (!Number.isInteger(item.quantity)) {
          errors.push(`Item ${index + 1}: Quantidade deve ser um número inteiro`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Estratégia de validação para atualização de produto
 */
export class ProductUpdateValidationStrategy extends IValidationStrategy {
  validate(updateData) {
    const errors = [];

    // Para update, os campos são opcionais, mas se fornecidos devem ser válidos
    if (updateData.name !== undefined) {
      if (updateData.name.trim().length === 0) {
        errors.push('Nome não pode ser vazio');
      } else if (updateData.name.length < 3) {
        errors.push('Nome deve ter no mínimo 3 caracteres');
      } else if (updateData.name.length > 100) {
        errors.push('Nome deve ter no máximo 100 caracteres');
      }
    }

    if (updateData.price !== undefined) {
      if (typeof updateData.price !== 'number') {
        errors.push('Preço deve ser um número');
      } else if (updateData.price < 0) {
        errors.push('Preço não pode ser negativo');
      } else if (updateData.price === 0) {
        errors.push('Preço deve ser maior que zero');
      }
    }

    if (updateData.stock !== undefined) {
      if (!Number.isInteger(updateData.stock)) {
        errors.push('Estoque deve ser um número inteiro');
      } else if (updateData.stock < 0) {
        errors.push('Estoque não pode ser negativo');
      }
    }

    if (updateData.category !== undefined) {
      if (updateData.category.trim().length === 0) {
        errors.push('Categoria não pode ser vazia');
      }
    }

    if (updateData.description !== undefined && updateData.description.length > 500) {
      errors.push('Descrição deve ter no máximo 500 caracteres');
      }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
