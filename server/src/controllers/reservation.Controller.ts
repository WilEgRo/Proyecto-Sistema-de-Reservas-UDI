import { Request, Response } from "express";
import Reservation from '../models/reservation.Model';

// Interfaz de TS
interface RequestWithUser extends Request {
  user?: { id: string; role: string; }
}

// --- Crear Reserva (Docente) ---
export const createReservation = async (req: Request, res: Response) => {
  const { recurso, fechaInicio, fechaFin, proposito } = req.body;
  const solicitante = (req as RequestWithUser).user!.id;

  // Validar fechas básicas
  const start = new Date(fechaInicio);
  const end = new Date(fechaFin);
  if (start >= end) {
    return res.status(400).json({ message: 'La fecha de fin debe ser posterior al inicio' });
  }

  try {
    // VALIDACIÓN DE SOLAPAMIENTO (REQUISITO CRÍTICO) 
    // Buscamos si existe alguna reserva APROBADA que choque con este horario
    const traslape = await Reservation.findOne({
      recurso,
      estado: 'APROBADA',
      $or: [
        // Caso A: La nueva empieza dentro de una existente
        { fechaInicio: { $lt: end, $gte: start } },
        // Caso B: La nueva termina dentro de una existente
        { fechaFin: { $gt: start, $lte: end } },
        // Caso C: La nueva envuelve completamente a una existente
        { fechaInicio: { $lte: start }, fechaFin: { $gte: end } }
      ]
    });

    if (traslape) {
      return res.status(400).json({ message: 'El recurso ya está reservado en ese horario' });
    }

    // Crear reserva PENDIENTE
    const newReservation = await Reservation.create({
      solicitante,
      recurso,
      fechaInicio: start,
      fechaFin: end,
      proposito,
      estado: 'PENDIENTE'
    });

    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reserva', error });
  }
};

// --- Listar Reservas (Filtro por Rol) ---
export const getReservations = async (req: Request, res: Response) => {
  const { role, id } = (req as RequestWithUser).user!;
  const { estado } = req.query;
  
  const filter: any = {};
  if (estado) filter.estado = estado;

  // REGLA DE NEGOCIO [cite: 141]
  if (role === 'DOCENTE') {
    filter.solicitante = id; // Docente solo ve las suyas
  }
  // Gestor y Admin ven todas (el filtro vacío trae todo)

  try {
    const reservations = await Reservation.find(filter)
      .populate('recurso', 'nombre tipo')
      .populate('solicitante', 'username')
      .sort({ fechaInicio: 1 }); // Ordenar por fecha

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
};

// --- Gestionar Reserva (Aprobar/Rechazar - Gestor) ---
export const updateReservation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { estado, notasAdmin } = req.body; // APROBADA, RECHAZADA, FINALIZADA

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });

    // Si se aprueba, podríamos re-verificar solapamiento por seguridad, 
    // pero asumimos que el gestor tiene la última palabra.
    
    reservation.estado = estado;
    if (notasAdmin) reservation.notasAdmin = notasAdmin;

    await reservation.save();
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar reserva' });
  }
};