import { Router } from 'express';
import { createReservation, getReservations, updateReservation } from '../controllers/reservation.Controller';
import { checkAuth } from '../middlewares/checkAuth';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

//----------------------------------------
// Rutas GET
//----------------------------------------
router.get('/', checkAuth, getReservations);

  
//----------------------------------------
// Rutas POST
//----------------------------------------
router.post(
  '/', 
  checkAuth, 
  checkRole(['DOCENTE']), 
  createReservation
);

//----------------------------------------
// Rutas PATCH
//----------------------------------------
router.patch(
  '/:id', 
  checkAuth, 
  checkRole(['GESTOR']), 
  updateReservation
);

export default router;