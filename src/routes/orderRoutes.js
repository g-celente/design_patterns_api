import express from 'express';
import { OrderController } from '../controllers/OrderController.js';

const router = express.Router();
const controller = new OrderController();

// Rotas de estatísticas e dados especiais (antes das rotas com :id)
router.get('/stats', (req, res) => controller.getStatistics(req, res));
router.get('/realtime-stats', (req, res) => controller.getRealtimeStats(req, res));
router.get('/audit-logs', (req, res) => controller.getAuditLogs(req, res));

// Rotas CRUD básicas
router.get('/', (req, res) => controller.getAll(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.updateStatus(req, res));
router.delete('/:id', (req, res) => controller.cancel(req, res));

export default router;
