/**
 * PADRÃO REPOSITORY
 * 
 * Interface base para todos os repositórios
 * Define o contrato que todos os repositórios devem implementar
 */
export class IRepository {
  async findAll() {
    throw new Error('Método findAll() deve ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById() deve ser implementado');
  }

  async create(entity) {
    throw new Error('Método create() deve ser implementado');
  }

  async update(id, entity) {
    throw new Error('Método update() deve ser implementado');
  }

  async delete(id) {
    throw new Error('Método delete() deve ser implementado');
  }
}
