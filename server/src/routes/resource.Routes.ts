import { Router } from 'express';
import { createResource, getResources, updateResource } from '../controllers/resource.Controller';
import { checkAuth } from '../middlewares/checkAuth';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

// GET /api/resources - Docentes, Gestores y Admin pueden ver catálogo
router.get('/', checkAuth, getResources);

// POST /api/resources - Solo Gestor o Admin crean recursos
router.post(
  '/', 
  checkAuth, 
  checkRole(['GESTOR', 'ADMIN']), 
  createResource
);

// PATCH /api/resources/:id - Gestor actualiza estado o registra incidencias
router.patch(
  '/:id', 
  checkAuth, 
  checkRole(['GESTOR', 'ADMIN']), 
  updateResource
);
export default router;