import { Router } from 'express';
import { createUser, getAllUsers, updateUser } from '../controllers/user.Controller';
import { checkAuth } from '../middlewares/checkAuth';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

// Todas las rutas protegidas solo para ADMIN
router.get('/', checkAuth, checkRole(['ADMIN']), getAllUsers);
router.post('/', checkAuth, checkRole(['ADMIN']), createUser);

// PATCH para actualizaciones parciales (rol, activo) 
router.patch('/:id', checkAuth, checkRole(['ADMIN']), updateUser);

export default router;