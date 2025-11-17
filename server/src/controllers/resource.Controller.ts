import { Request, Response } from "express";
import Resource from "../models/resource.model";

export const createResource = async (req: Request, res: Response) => {
  const { nombre, tipo, capacidad, descripcion } = req.body;
  try {
    const resource = await Resource.create({
      nombre, tipo, capacidad, descripcion, estado: 'DISPONIBLE'
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear recurso' });
  }
};

// --- Listar Recursos (Público para docentes) ---
export const getResources = async (req: Request, res: Response) => {
  try {
    const resources = await Resource.find({});
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener recursos' });
  }
};

// --- Actualizar Recurso e Incidencias (Gestor) ---
export const updateResource = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { estado, nuevaIncidencia } = req.body;

  try {
    const resource = await Resource.findById(id);
    if (!resource) return res.status(404).json({ message: 'Recurso no encontrado' });

    // Cambio de estado (DISPONIBLE <-> FUERA_DE_SERVICIO)
    if (estado) resource.estado = estado;

    // Registrar incidencia
    if (nuevaIncidencia) {
      resource.incidencias.push(`${new Date().toISOString().split('T')[0]}: ${nuevaIncidencia}`);
      // Opcional: Si reportan daño, poner en fuera de servicio automáticamente
      resource.estado = 'FUERA_DE_SERVICIO';
    }

    await resource.save();
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar recurso' });
  }
};