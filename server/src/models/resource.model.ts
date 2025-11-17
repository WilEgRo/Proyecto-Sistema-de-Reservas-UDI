import { Schema, Document, model, Model } from "mongoose";

// interfaz para el documento de paciente
export interface IResource extends Document {
    nombre: string; // Ej: "Sala 1", "Kit Arduino"
    tipo: 'SALA' | 'EQUIPO';
    capacidad?: number; // Solo para salas
    estado: 'DISPONIBLE' | 'FUERA_DE_SERVICIO';
    incidencias: string[];
}

// esquema de MONGOOSE
const resourceSchema: Schema<IResource> = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    tipo: {
        type: String,
        required: true,
        enum: ['SALA', 'EQUIPO'],
    },
    capacidad: {
        type: Number,
        default: 0,
    },
    estado: {
        type: String,
        required: true,
        enum: ['DISPONIBLE', 'FUERA_DE_SERVICIO'],
        default: 'DISPONIBLE',
    }
})

const Resource: Model<IResource> = model<IResource>("Resource", resourceSchema);
export default Resource;