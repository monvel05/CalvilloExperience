export interface DatosNegocio {
    idNegocio: number;
    nombre: string;
    descripcion: string;
    idSubtipo_Negocio: number;
    verificado: boolean;
    horario: string;
    telefono: string;
    calificacionMedia: number;
    imagen: string[];
    idUsuario: number;
    idUbicacion: number;
    ubicacion: {
        direccionCompleta: string;
        municipio: string;
        latitud: string;
        longitud: string;
    };
    tieneInventario: boolean;
    permitirReservas: boolean;
}