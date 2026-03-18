export interface DatosNegocio {
  idNegocio: number;
  nombre: string;
  descripcion: string; // Viene de la tabla negocios_traduccion (según el idioma)
  verificado: boolean; // Viene de negocios.verificado (TINYINT convertido a boolean)
  horario: string;
  telefono: string;
  calificacionMedia: number; // Promedio calculado de la tabla resenas
  imagen: string[]; // Array extraído de la tabla fotos_nego
  ubicacion: {
    direccionCompleta: string; // Concatenación de calle, numero, colonia, etc.
    municipio: string;
    latitud: string;
    longitud: string;
  };
  tieneInventario: boolean; // Si hay registros en 'inventario' para habilitar reservas
}