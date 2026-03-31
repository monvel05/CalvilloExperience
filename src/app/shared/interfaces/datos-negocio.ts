export interface DatosNegocio {
    idNegocio: number;
    nombre: string;
    descripcion: string;
    idSubtipo_Negocio: number;
    categoria?: string; 
    subcategoria?: string;
    verificado: boolean;
    horario: string;
    telefono: string;
    calificacionMedia: number; 
    calificacion?: number;
    imagen: string[];
    ubicacion: {
        direccionCompleta: string;
        municipio: string;
        latitud: string;
        longitud: string;
    };
    tieneInventario: boolean;
}