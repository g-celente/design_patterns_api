import express from 'express';
import { ProductController } from '../controllers/ProductController.js';

const router = express.Router();
const controller = new ProductController();

// Rotas de estatísticas e buscas especiais (antes das rotas com :id)
router.get('/stats', (req, res) => controller.getStatistics(req, res));
router.get('/low-stock', (req, res) => controller.getLowStock(req, res));
router.get('/search', (req, res) => controller.search(req, res));
router.get('/category/:category', (req, res) => controller.getByCategory(req, res));

// Rotas CRUD básicas
router.get('/', (req, res) => controller.getAll(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export default router;
