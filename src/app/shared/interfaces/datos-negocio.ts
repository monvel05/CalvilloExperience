export interface DatosNegocio {
  idNegocio: number;
  nombre: string;
  verificado: boolean;
  horario?: string;
  telefono?: string;
  
  // Datos que vienen de los JOINs en Express
  descripcion?: string; 
  categoria?: string;
  subcategoria?: string; 
  
  // Métricas y multimedia
  calificacionMedia?: number; 
  imagen?: string[]; 
  
  // Estructura de Ubicación
  idUbicacion?: number;
  ubicacion?: {
    direccionCompleta?: string;
    municipio?: string;
    // OJO: Es mejor manejarlas como number para las APIs de mapas
    latitud: number; 
    longitud: number; 
    calle?: string;
    numero?: string;
    colonia?: string;
  };
  
  // Banderas de operación
  tieneInventario?: boolean; 
  permitirReservas?: boolean;
}