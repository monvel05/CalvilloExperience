export interface PuntoInteres {
  id: number;
  nombre: string;
  categoria: 'museo' | 'presa' | 'guayaberas'; // Se va a modificar
  coordenadas: google.maps.LatLngLiteral;
  iconoUrl: string; // Ruta al archivo .png o .svg
}
