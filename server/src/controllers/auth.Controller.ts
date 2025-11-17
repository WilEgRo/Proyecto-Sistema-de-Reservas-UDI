import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

//funcion para generar el token
const generateToken = (id: string, role: string) => {
    const secret = process.env.JWT_SECRET as string;
    return jwt.sign({ id, role}, secret, {
        expiresIn: '1d',
    });
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        // verificar si el usuario existe
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas (usuario)' });
        }

        // --- NUEVA VALIDACIÓN: CUENTA ACTIVA ---
        if (!user.active) {
        return res.status(403).json({ message: 'Esta cuenta ha sido desactivada. Contacte al administrador.' });
        }

        // verificar la contraseña
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas (contraseña)' });
        }

        // generar y enviar el token
        const token = generateToken(String(user._id), user.role);
        res.json({ 
            message: 'Login exitoso',
            token,
            user: {
                id: String(user._id),
                username: user.username,
                role: user.role,
            }
         });

    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error del servidor', error: error.message });
        }else{
            res.status(500).json({ message: 'Error del servidor desconocido' });
        }
    }
};
