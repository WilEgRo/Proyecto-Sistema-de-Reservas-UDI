import mongoose from 'mongoose';
import User from './models/user.model';
import Resource from './models/resource.model';
import Reservation from './models/reservation.Model';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const users = [
  {
    username: 'admin',
    password: 'password123',
    role: 'ADMIN',
    active: true
  },
  {
    username: 'gestor1',
    password: 'password123',
    role: 'GESTOR', // Encargado de aprobar reservas
    active: true
  },
  {
    username: 'docente_juan',
    password: 'password123',
    role: 'DOCENTE', // Solicita reservas
    active: true
  },
  {
    username: 'docente_maria',
    password: 'password123',
    role: 'DOCENTE',
    active: true
  },
  {
    username: 'usuario_inactivo',
    password: 'password123',
    role: 'DOCENTE',
    active: false // Para probar el bloqueo de login
  }
];

const resources = [
  // SALAS
  {
    nombre: "Sala de Innovación 1",
    tipo: "SALA",
    capacidad: 10,
    estado: "DISPONIBLE",
    descripcion: "Sala con pizarra inteligente y mesas de trabajo grupal."
  },
  {
    nombre: "Laboratorio de Cómputo A",
    tipo: "SALA",
    capacidad: 25,
    estado: "DISPONIBLE",
    descripcion: "Equipos i7 de última generación para desarrollo."
  },
  {
    nombre: "Sala de Reuniones B",
    tipo: "SALA",
    capacidad: 6,
    estado: "DISPONIBLE",
    descripcion: "Ideal para tutorías de tesis."
  },
  
  // EQUIPOS
  {
    nombre: "Kit Arduino #01",
    tipo: "EQUIPO",
    estado: "DISPONIBLE",
    descripcion: "Kit básico con sensores y protoboard."
  },
  {
    nombre: "Kit Robótica LEGO Mindstorms",
    tipo: "EQUIPO",
    estado: "DISPONIBLE",
    descripcion: "Set completo para la materia de Robótica."
  },
  {
    nombre: "Impresora 3D Creality",
    tipo: "EQUIPO",
    estado: "FUERA_DE_SERVICIO", // Para que el gestor vea una incidencia
    descripcion: "Ubicada en el Lab de Prototipado.",
    incidencias: ["17/11/2025: Boquilla obstruida, requiere mantenimiento."]
  },
  {
    nombre: "Cámara Sony Alpha",
    tipo: "EQUIPO",
    estado: "DISPONIBLE",
    descripcion: "Cámara profesional para grabación de clases."
  },
  {
    nombre: "Tablet Samsung Tab S8",
    tipo: "EQUIPO",
    estado: "DISPONIBLE",
    descripcion: "Para pruebas de aplicaciones móviles."
  }
];

const seedDB = async () => {
  const MONGO_URI = process.env.MONGO_URI as string;

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB para el seeding...');

    // 1. Limpiar colecciones antiguas
    await User.deleteMany({});
    await Resource.deleteMany({});
    await Reservation.deleteMany({}); // Limpiamos reservas para empezar de cero
    console.log('Datos antiguos eliminados (Usuarios, Recursos, Reservas).');

    // 2. Crear Usuarios
    await User.create(users);
    console.log(`${users.length} Usuarios creados (Admin, Gestor, Docentes).`);

    // 3. Crear Recursos
    await Resource.create(resources);
    console.log(`${resources.length} Recursos creados (Salas y Equipos).`);

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error durante el seeding:', error.message);
    } else {
      console.error('Error desconocido durante el seeding.');
    }
  } finally {
    // Cerrar la conexión
    await mongoose.connection.close();
    console.log('Conexión de MongoDB cerrada.');
  }
};

// Ejecutar el script
seedDB();