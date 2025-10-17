/**
 * Script de Demonstração da API
 * 
 * Este script demonstra todos os padrões de projeto em ação:
 * - Singleton (Database)
 * - Repository (ProductRepository, OrderRepository)
 * - Factory Method (RepositoryFactory)
 * - Strategy (Descontos e Validações)
 * - Observer (Notificações)
 * - Facade (OrderFacade)
 */

import { Database } from './config/Database.js';
import { ProductService } from './services/ProductService.js';
import { OrderService } from './services/OrderService.js';
import { PercentageDiscountStrategy, TieredDiscountStrategy, BlackFridayDiscountStrategy } from './strategies/DiscountStrategies.js';

async function runDemo() {
  console.log('\n' + '='.repeat(80));
  console.log('🎯 DEMONSTRAÇÃO DOS PADRÕES DE PROJETO GoF');
  console.log('='.repeat(80) + '\n');

  // ========================================
  // 1. SINGLETON - Database
  // ========================================
  console.log('\n📦 1. PADRÃO SINGLETON - Database');
  console.log('-'.repeat(80));
  
  const db1 = Database.getInstance();
  const db2 = Database.getInstance();
  
  console.log(`✅ db1 === db2? ${db1 === db2} (mesma instância)`);
  await db1.connect();

  // ========================================
  // 2. FACTORY METHOD + REPOSITORY
  // ========================================
  console.log('\n🏭 2. PADRÃO FACTORY METHOD + REPOSITORY');
  console.log('-'.repeat(80));
  
  const productService = new ProductService();
  
  // Criar produtos usando Factory Method (interno no Service)
  console.log('\n📝 Criando produtos...');
  
  const product1 = await productService.createProduct({
    name: 'Notebook Dell XPS 13',
    description: 'Notebook ultraportátil com processador Intel i7',
    price: 5999.90,
    stock: 25,
    category: 'Eletrônicos'
  });
  console.log(`✅ Produto criado: ${product1.name} (ID: ${product1.id})`);

  const product2 = await productService.createProduct({
    name: 'Mouse Logitech MX Master 3',
    description: 'Mouse ergonômico sem fio',
    price: 399.90,
    stock: 100,
    category: 'Periféricos'
  });
  console.log(`✅ Produto criado: ${product2.name} (ID: ${product2.id})`);

  const product3 = await productService.createProduct({
    name: 'Monitor LG UltraWide 34"',
    description: 'Monitor curvo 21:9 WQHD',
    price: 2499.90,
    stock: 15,
    category: 'Monitores'
  });
  console.log(`✅ Produto criado: ${product3.name} (ID: ${product3.id})`);

  const product4 = await productService.createProduct({
    name: 'Teclado Mecânico Keychron K2',
    description: 'Teclado mecânico RGB 75%',
    price: 599.90,
    stock: 8, // Estoque baixo para demonstrar Observer
    category: 'Periféricos'
  });
  console.log(`✅ Produto criado: ${product4.name} (ID: ${product4.id})`);

  // Listar produtos (Repository)
  const allProducts = await productService.getAllProducts();
  console.log(`\n📊 Total de produtos cadastrados: ${allProducts.length}`);

  // ========================================
  // 3. STRATEGY - Validações
  // ========================================
  console.log('\n♟️ 3. PADRÃO STRATEGY - Validações');
  console.log('-'.repeat(80));
  
  console.log('\n❌ Tentando criar produto inválido...');
  try {
    await productService.createProduct({
      name: 'AB', // Nome muito curto
      price: -100, // Preço negativo
      stock: -5 // Estoque negativo
    });
  } catch (error) {
    console.log(`✅ Validação funcionou: ${error.message}`);
  }

  // ========================================
  // 4. OBSERVER + FACADE - Criação de Pedidos
  // ========================================
  console.log('\n👀 4. PADRÃO OBSERVER + FACADE');
  console.log('-'.repeat(80));
  
  const orderService = new OrderService();

  // Pedido 1: Sem desconto
  console.log('\n📦 Criando Pedido 1 - Sem desconto');
  const order1 = await orderService.createOrder({
    customerId: 'CUST001',
    customerName: 'João Silva',
    items: [
      { productId: product2.id, quantity: 2 }, // 2x Mouse = R$ 799.80
      { productId: product4.id, quantity: 1 }  // 1x Teclado = R$ 599.90
    ]
  });
  console.log(`✅ Pedido ${order1.id} criado: R$ ${order1.total.toFixed(2)}`);

  // Pedido 2: Com desconto percentual (Strategy)
  console.log('\n📦 Criando Pedido 2 - Desconto 10%');
  orderService.setDiscountStrategy(new PercentageDiscountStrategy(10));
  const order2 = await orderService.createOrder({
    customerId: 'CUST002',
    customerName: 'Maria Santos',
    items: [
      { productId: product3.id, quantity: 1 } // Monitor = R$ 2.499,90
    ]
  });
  console.log(`✅ Pedido ${order2.id} criado: R$ ${order2.total.toFixed(2)}`);

  // Pedido 3: Com desconto progressivo (Strategy)
  console.log('\n📦 Criando Pedido 3 - Desconto Progressivo');
  orderService.setDiscountStrategy(new TieredDiscountStrategy());
  const order3 = await orderService.createOrder({
    customerId: 'CUST003',
    customerName: 'Pedro Costa',
    items: [
      { productId: product1.id, quantity: 1 }, // Notebook = R$ 5.999,90
      { productId: product2.id, quantity: 1 }, // Mouse = R$ 399,90
      { productId: product3.id, quantity: 1 }  // Monitor = R$ 2.499,90
      // Total: R$ 8.899,70 -> Desconto 15% (acima de R$ 1.000)
    ]
  });
  console.log(`✅ Pedido ${order3.id} criado: R$ ${order3.total.toFixed(2)}`);

  // Pedido 4: Black Friday! (Strategy)
  console.log('\n📦 Criando Pedido 4 - BLACK FRIDAY 30% OFF!');
  orderService.setDiscountStrategy(new BlackFridayDiscountStrategy());
  const order4 = await orderService.createOrder({
    customerId: 'CUST004',
    customerName: 'Ana Lima',
    items: [
      { productId: product1.id, quantity: 1 } // Notebook com 30% OFF
    ]
  });
  console.log(`✅ Pedido ${order4.id} criado: R$ ${order4.total.toFixed(2)}`);

  // ========================================
  // 5. FACADE - Operações Complexas
  // ========================================
  console.log('\n🎭 5. PADRÃO FACADE - Operações Complexas Simplificadas');
  console.log('-'.repeat(80));
  
  // Atualizar status do pedido (Facade simplifica + Observer notifica)
  console.log('\n📝 Atualizando status do pedido 1...');
  await orderService.updateOrderStatus(order1.id, 'PROCESSING');
  
  console.log('\n📝 Completando pedido 1...');
  await orderService.updateOrderStatus(order1.id, 'COMPLETED');

  // Cancelar pedido (Facade simplifica: restaura estoque + notifica)
  console.log('\n❌ Cancelando pedido 2...');
  await orderService.cancelOrder(order2.id);

  // ========================================
  // 6. OBSERVER - Logs e Estatísticas
  // ========================================
  console.log('\n📊 6. PADRÃO OBSERVER - Logs e Estatísticas Coletadas');
  console.log('-'.repeat(80));
  
  // Estatísticas coletadas pelos Observers
  const realtimeStats = orderService.getRealtimeStatistics();
  console.log('\n📈 Estatísticas em Tempo Real (StatisticsObserver):');
  console.log(`   - Pedidos criados: ${realtimeStats.ordersCreated}`);
  console.log(`   - Pedidos completos: ${realtimeStats.ordersCompleted}`);
  console.log(`   - Pedidos cancelados: ${realtimeStats.ordersCancelled}`);
  console.log(`   - Receita total: R$ ${realtimeStats.totalRevenue.toFixed(2)}`);
  console.log(`   - Alertas de estoque baixo: ${realtimeStats.lowStockAlerts}`);

  // Logs de auditoria
  const auditLogs = orderService.getAuditLogs();
  console.log(`\n📝 Logs de Auditoria (AuditLogObserver): ${auditLogs.length} eventos registrados`);
  
  // ========================================
  // 7. REPOSITORY - Queries Especializadas
  // ========================================
  console.log('\n🗄️ 7. PADRÃO REPOSITORY - Queries Especializadas');
  console.log('-'.repeat(80));
  
  const lowStockProducts = await productService.getLowStockProducts(10);
  console.log(`\n⚠️  Produtos com estoque baixo (<10): ${lowStockProducts.length}`);
  lowStockProducts.forEach(p => {
    console.log(`   - ${p.name}: ${p.stock} unidades`);
  });

  const eletronicos = await productService.getProductsByCategory('Eletrônicos');
  console.log(`\n💻 Produtos na categoria Eletrônicos: ${eletronicos.length}`);

  const searchResults = await productService.searchProductsByName('Mouse');
  console.log(`\n🔍 Busca por "Mouse": ${searchResults.length} resultado(s)`);

  // ========================================
  // 8. Estatísticas Finais
  // ========================================
  console.log('\n📊 8. ESTATÍSTICAS FINAIS');
  console.log('-'.repeat(80));
  
  const productStats = await productService.getProductStatistics();
  console.log('\n📦 Estatísticas de Produtos:');
  console.log(`   - Total de produtos: ${productStats.totalProducts}`);
  console.log(`   - Valor total em estoque: R$ ${productStats.totalValue.toFixed(2)}`);
  console.log(`   - Produtos sem estoque: ${productStats.outOfStock}`);
  console.log(`   - Produtos com estoque baixo: ${productStats.lowStock}`);
  console.log('   - Produtos por categoria:');
  Object.entries(productStats.categories).forEach(([cat, count]) => {
    console.log(`     • ${cat}: ${count}`);
  });

  const orderStats = await orderService.getOrderStatistics();
  console.log('\n📋 Estatísticas de Pedidos:');
  console.log(`   - Total de pedidos: ${orderStats.total}`);
  console.log(`   - Pendentes: ${orderStats.pending}`);
  console.log(`   - Em processamento: ${orderStats.processing}`);
  console.log(`   - Completos: ${orderStats.completed}`);
  console.log(`   - Cancelados: ${orderStats.cancelled}`);
  console.log(`   - Receita total (completos): R$ ${orderStats.totalSales.toFixed(2)}`);

  const dbStats = db1.getStats();
  console.log('\n🗄️ Estatísticas do Database (Singleton):');
  console.log(`   - Produtos no DB: ${dbStats.totalProducts}`);
  console.log(`   - Pedidos no DB: ${dbStats.totalOrders}`);

  // ========================================
  // Finalização
  // ========================================
  console.log('\n' + '='.repeat(80));
  console.log('✅ DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO!');
  console.log('='.repeat(80));
  console.log('\n🎯 Padrões Demonstrados:');
  console.log('   ✅ 1. Singleton - Database (instância única)');
  console.log('   ✅ 2. Repository - Separação de persistência');
  console.log('   ✅ 3. Factory Method - Criação de repositórios');
  console.log('   ✅ 4. Strategy - Descontos e validações (10 estratégias)');
  console.log('   ✅ 5. Observer - Sistema de notificações (4 observers)');
  console.log('   ✅ 6. Facade - Operações complexas simplificadas');
  console.log('\n💡 Veja os logs acima para ver os padrões em ação!\n');

  await db1.disconnect();
}

// Executar demonstração
runDemo().catch(console.error);
