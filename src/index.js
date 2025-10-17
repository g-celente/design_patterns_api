import express from 'express';
import { Database } from './config/Database.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parse de JSON
app.use(express.json());

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`\n📡 ${req.method} ${req.path}`);
  next();
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API REST com Padrões de Projeto GoF',
    version: '1.0.0',
    patterns: [
      'Singleton (Database)',
      'Repository (ProductRepository, OrderRepository)',
      'Factory Method (RepositoryFactory)',
      'Strategy (DiscountStrategies, ValidationStrategies)',
      'Observer (Event Notifications)',
      'Facade (OrderFacade)'
    ],
    endpoints: {
      products: '/api/products',
      orders: '/api/orders'
    },
    documentation: {
      products: {
        'GET /api/products': 'Lista todos os produtos',
        'GET /api/products/:id': 'Busca produto por ID',
        'POST /api/products': 'Cria novo produto',
        'PUT /api/products/:id': 'Atualiza produto',
        'DELETE /api/products/:id': 'Deleta produto',
        'GET /api/products/stats': 'Estatísticas de produtos',
        'GET /api/products/low-stock': 'Produtos com estoque baixo',
        'GET /api/products/search?name=': 'Busca por nome',
        'GET /api/products/category/:category': 'Busca por categoria'
      },
      orders: {
        'GET /api/orders': 'Lista todos os pedidos',
        'GET /api/orders/:id': 'Busca pedido por ID',
        'POST /api/orders': 'Cria novo pedido',
        'PUT /api/orders/:id': 'Atualiza status do pedido',
        'DELETE /api/orders/:id': 'Cancela pedido',
        'GET /api/orders/stats': 'Estatísticas de pedidos',
        'GET /api/orders/realtime-stats': 'Estatísticas em tempo real',
        'GET /api/orders/audit-logs': 'Logs de auditoria'
      }
    }
  });
});

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Inicialização do servidor
async function startServer() {
  try {
    console.log('\n🚀 Iniciando API REST com Padrões de Projeto GoF...\n');
    
    // Conectar ao banco de dados (Singleton)
    const db = Database.getInstance();
    await db.connect();
    
    console.log('📊 Estatísticas do Database:', db.getStats());
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n✅ Servidor rodando na porta ${PORT}`);
      console.log(`📝 Documentação: http://localhost:${PORT}/`);
      console.log(`🛍️  Produtos: http://localhost:${PORT}/api/products`);
      console.log(`📦 Pedidos: http://localhost:${PORT}/api/orders`);
      console.log('\n🎯 Padrões de Projeto implementados:');
      console.log('   1. Singleton - Database (instância única)');
      console.log('   2. Repository - Separação de persistência');
      console.log('   3. Factory Method - Criação de repositórios');
      console.log('   4. Strategy - Descontos e validações');
      console.log('   5. Observer - Sistema de notificações');
      console.log('   6. Facade - Operações complexas simplificadas');
      console.log('\n💡 Pressione Ctrl+C para parar o servidor\n');
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de shutdown gracioso
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Encerrando servidor...');
  
  const db = Database.getInstance();
  await db.disconnect();
  
  console.log('👋 Servidor encerrado com sucesso!\n');
  process.exit(0);
});

// Iniciar aplicação
startServer();

export default app;
