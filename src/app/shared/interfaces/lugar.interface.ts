export interface Lugar {
  nombre: string;
  direccion: string;
  coords: {
    lat: number;
    lng: number;
  };
  telefono?: string;
  precio?: string;
  categoria?: string;
}