import { Schema, Document, model, Model, Types } from 'mongoose';

// Estados permitidos según el caso
type ReservationStatus = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'FINALIZADA';

export interface IReservation extends Document {
  solicitante: Types.ObjectId; // Docente
  recurso: Types.ObjectId;    // Sala o Equipo
  fechaInicio: Date;
  fechaFin: Date;
  proposito: string;          // Motivo de uso
  estado: ReservationStatus;
  notasAdmin?: string;        // Razón de rechazo o notas del gestor
}

const reservationSchema: Schema<IReservation> = new Schema({
  solicitante: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referencia al usuario (Docente)
    required: true,
  },
  recurso: {
    type: Schema.Types.ObjectId,
    ref: 'Resource', // Referencia al recurso
    required: true,
  },
  fechaInicio: {
    type: Date,
    required: true,
  },
  fechaFin: {
    type: Date,
    required: true,
  },
  proposito: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    required: true,
    enum: ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'FINALIZADA'],
    default: 'PENDIENTE',
  },
  notasAdmin: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Reservation: Model<IReservation> = model<IReservation>('Reservation', reservationSchema);

export default Reservation;