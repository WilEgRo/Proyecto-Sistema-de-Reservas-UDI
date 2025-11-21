import { Request, Response } from 'express';
import User from '../models/user.model';

// --- Crear un nuevo usuario (Rol: ADMIN) ---
export const createUser = async (req: Request, res: Response) => {
  const { username, password, role, role2 } = req.body;

  // Validación básica
  if (!username || !password || !role || !role2) {
    return res.status(400).json({ message: 'Todos los campos son requeridos (username, password, role, role2)' });
  }

  try {
    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Crear el usuario
    // El 'pre-save' hook en 'userModel' se encargará de hashear el password
    const user = await User.create({
      username,
      password,
      role,
    });

    // Devolver el usuario creado (sin el password)
    res.status(201).json({
      id: user._id,
      username: user.username,
      role: user.role,
      role2: user.role2,
      active: user.active,
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

// --- Listar todos los usuarios (Rol: ADMIN) ---
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Usamos .select('-password') para excluir explícitamente el campo password
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

// --- Actualizar Usuario (Admin) ---
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, role2, active } = req.body; // Recibimos active

  try {
    const user = await User.findByIdAndUpdate(
      id, 
      { role, role2, active }, 
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};