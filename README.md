# 🎯 API REST com Padrões de Projeto GoF

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

API REST profissional desenvolvida em Node.js com **arquitetura orientada a objetos** aplicando **6 padrões de projeto da GoF** (Gang of Four). Projeto educacional demonstrando aplicação prática de design patterns em um contexto real.

---

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Opção 1: Iniciar servidor API
npm start

# Opção 2: Ver demonstração dos padrões
npm run demo
```

📖 **[Guia Completo de Instalação e Primeiros Passos →](QUICKSTART.md)**

---

## 🎯 Padrões de Projeto Implementados

### 🔵 Padrões Criacionais
1. **Singleton** - Gerenciamento de conexão única com banco de dados
2. **Factory Method** - Criação centralizada de repositórios

### 🟢 Padrões Estruturais
3. **Repository** - Separação da lógica de persistência
4. **Facade** - Interface simplificada para operações complexas

### 🟡 Padrões Comportamentais
5. **Strategy** - Múltiplas estratégias de desconto e validação (10 implementações)
6. **Observer** - Sistema de notificações de eventos (4 observadores)

📚 **[Análise Técnica Detalhada →](RELATORIO_TECNICO.md)**

---

## 📋 Documentação Completa

### 🎓 Para Iniciantes
- **[QUICKSTART.md](QUICKSTART.md)** - Instalação e primeiros passos (5 minutos)
- **[GUIA_USO.md](GUIA_USO.md)** - Tutorial completo com exemplos de requisições HTTP
- **[EXEMPLOS_CODIGO.md](EXEMPLOS_CODIGO.md)** - Snippets práticos comparando "antes vs depois"

### 🏗️ Para Desenvolvedores
- **[DIAGRAMA_UML.md](DIAGRAMA_UML.md)** - Diagrama de classes completo (Mermaid)
- **[RELATORIO_TECNICO.md](RELATORIO_TECNICO.md)** - Análise detalhada dos padrões (50+ páginas)
- **[INDICE.md](INDICE.md)** - Índice completo de toda documentação

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Setup
```bash
# Clone ou baixe o projeto
cd api_products

# Instale as dependências
npm install
```

## ▶️ Executar

### Servidor API REST
```bash
npm start
```
Acesse: http://localhost:3000

### Script de Demonstração
```bash
npm run demo
```
Executa demonstração completa dos padrões em ação (logs detalhados)

---

## 🌐 Endpoints da API

### 📦 Produtos (8 endpoints)
```
GET    /api/products              # Listar todos
GET    /api/products/:id          # Buscar por ID
POST   /api/products              # Criar produto
PUT    /api/products/:id          # Atualizar produto
DELETE /api/products/:id          # Deletar produto
GET    /api/products/stats        # Estatísticas
GET    /api/products/low-stock    # Estoque baixo
GET    /api/products/search?name= # Buscar por nome
```

### 📋 Pedidos (8 endpoints)
```
GET    /api/orders                # Listar todos
GET    /api/orders/:id            # Buscar por ID
POST   /api/orders                # Criar pedido
PUT    /api/orders/:id            # Atualizar status
DELETE /api/orders/:id            # Cancelar pedido
GET    /api/orders/stats          # Estatísticas
GET    /api/orders/realtime-stats # Stats em tempo real (Observer)
GET    /api/orders/audit-logs     # Logs de auditoria
```

📖 **[Guia Completo de Uso da API →](GUIA_USO.md)**

---

## 🏗️ Arquitetura do Projeto

```
src/
├── config/
│   └── Database.js              # 🔵 Singleton
│
├── models/
│   ├── Product.js               # Entidade Produto
│   └── Order.js                 # Entidade Pedido
│
├── repositories/
│   ├── IRepository.js           # 🟢 Interface Repository
│   ├── ProductRepository.js     # 🟢 Repository de Produtos
│   └── OrderRepository.js       # 🟢 Repository de Pedidos
│
├── factories/
│   └── RepositoryFactory.js     # 🔵 Factory Method
│
├── strategies/
│   ├── DiscountStrategies.js    # 🟡 7 Estratégias de Desconto
│   └── ValidationStrategies.js  # 🟡 3 Estratégias de Validação
│
├── observers/
│   ├── EventSubject.js          # 🟡 Subject (Observable)
│   └── ConcreteObservers.js     # 🟡 4 Observadores
│
├── facades/
│   └── OrderFacade.js           # 🟢 Facade
│
├── services/
│   ├── ProductService.js        # Lógica de Negócio
│   └── OrderService.js          # Lógica de Negócio
│
├── controllers/
│   ├── ProductController.js     # REST Controller
│   └── OrderController.js       # REST Controller
│
├── routes/
│   ├── productRoutes.js         # Rotas HTTP
│   └── orderRoutes.js           # Rotas HTTP
│
├── index.js                     # 🚀 Servidor Express
└── demo.js                      # 🎯 Script de Demonstração
```

---

## 💡 Destaques do Projeto

### ✨ Qualidade de Código
- ✅ **Programação Orientada a Objetos** - Classes, herança, polimorfismo
- ✅ **SOLID Principles** - Single Responsibility, Open/Closed, etc.
- ✅ **Clean Code** - Código autodocumentado e organizado
- ✅ **ES6+ Features** - Classes, modules, async/await
- ✅ **Error Handling** - Tratamento estruturado de erros

### 🎯 Padrões em Ação
- ✅ **10 Estratégias** - Descontos e validações intercambiáveis
- ✅ **4 Observadores** - Email, Audit, Statistics, Push Notifications
- ✅ **Operações Complexas** - Facade orquestra múltiplos subsistemas
- ✅ **Instância Única** - Singleton garante consistência
- ✅ **Separação de Concerns** - Repository isola persistência

### 📊 Métricas
- 📝 **2.500+ linhas** de código bem estruturado
- 🎨 **6 padrões GoF** implementados corretamente
- 📦 **26 arquivos** organizados em camadas
- 🌐 **18 endpoints** REST funcionais
- 📚 **Documentação completa** com exemplos práticos

---

## 🎓 Conceitos Aplicados

### Padrões de Projeto
- Singleton, Factory Method, Repository, Facade, Strategy, Observer

### Arquitetura
- Arquitetura em Camadas
- Separação de Concerns
- Dependency Injection
- Inversão de Dependências

### Boas Práticas
- SOLID Principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- Clean Code

---

## � Documentação Completa

| Documento | Descrição | Para Quem |
|-----------|-----------|-----------|
| **[QUICKSTART.md](QUICKSTART.md)** | Instalação e teste rápido (5 min) | 🎯 Iniciantes |
| **[GUIA_USO.md](GUIA_USO.md)** | Tutorial completo da API | 🎯 Iniciantes |
| **[EXEMPLOS_CODIGO.md](EXEMPLOS_CODIGO.md)** | Comparações práticas de código | 🎯 Iniciantes |
| **[DIAGRAMA_UML.md](DIAGRAMA_UML.md)** | Arquitetura visual completa | 🏗️ Desenvolvedores |
| **[RELATORIO_TECNICO.md](RELATORIO_TECNICO.md)** | Análise detalhada (50+ páginas) | 🏗️ Desenvolvedores |
| **[INDICE.md](INDICE.md)** | Índice completo | 📖 Todos |

---

## 🎬 Demonstração Rápida

### 1. Execute o script de demonstração
```bash
npm run demo
```

**Você verá:**
- ✅ Singleton criando instância única do Database
- ✅ Factory Method criando repositórios
- ✅ Repository isolando persistência
- ✅ Strategy aplicando diferentes descontos
- ✅ Observer notificando 4 listeners simultaneamente
- ✅ Facade simplificando operações complexas

### 2. Teste a API
```powershell
# Criar produto
$produto = @{
    name = "Notebook Dell"
    price = 3500
    stock = 10
    category = "Eletrônicos"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Post -Body $produto -ContentType "application/json"

# Criar pedido com desconto
$pedido = @{
    customerId = "CUST001"
    customerName = "João Silva"
    discountType = "tiered"
    items = @(
        @{ productId = 1; quantity = 2 }
    )
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "http://localhost:3000/api/orders" -Method Post -Body $pedido -ContentType "application/json"
```

---

## 🔮 Extensibilidade

### Fácil Adicionar Novos Recursos

#### Nova Estratégia de Desconto
```javascript
class CyberMondayStrategy extends IDiscountStrategy {
  calculate(total) { return total * 0.35; }
  getDescription() { return '🎮 Cyber Monday: 35% OFF!'; }
}
```

#### Novo Observador
```javascript
class SmsObserver extends IObserver {
  update(event) {
    if (event.type === 'ORDER_CREATED') {
      this.sendSms(event.data);
    }
  }
}
```

#### Novo Repository
```javascript
class CategoryRepository extends IRepository {
  // ... implementação
}

// Registrar na Factory
RepositoryFactory.TYPES.CATEGORY = 'category';
```

---

## 🚀 Próximos Passos Sugeridos

### Melhorias
- [ ] Testes automatizados (Jest)
- [ ] Autenticação JWT
- [ ] Banco de dados real (PostgreSQL/MongoDB)
- [ ] Paginação e filtros avançados
- [ ] Cache com Redis
- [ ] Documentação Swagger/OpenAPI
- [ ] Rate limiting
- [ ] Logging estruturado (Winston)

### Padrões Adicionais
- [ ] Decorator (cache em repositories)
- [ ] Chain of Responsibility (validações)
- [ ] Command (undo/redo)
- [ ] Template Method (CRUD base)
- [ ] Adapter (APIs externas)
- [ ] Builder (objetos complexos)

---

## 📖 Saiba Mais

### Padrões de Projeto
- [Livro: Design Patterns - GoF](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)
- [Refactoring Guru - Design Patterns](https://refactoring.guru/design-patterns)

### Node.js e Express
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

## 🤝 Contribuindo

Este é um projeto educacional. Sinta-se livre para:
- Estudar o código
- Usar como referência
- Fazer fork e adaptar
- Sugerir melhorias

---

## 📄 Licença

MIT License - Livre para uso educacional e comercial.

---

## 👨‍💻 Sobre

Projeto desenvolvido como demonstração acadêmica/profissional de aplicação prática de padrões de projeto GoF em Node.js com arquitetura orientada a objetos.

**Tecnologias:** Node.js, Express, ES6+ Modules, OOP  
**Padrões:** 6 padrões GoF implementados  
**Documentação:** Completa e detalhada  
**Versão:** 1.0.0

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!**
