export interface DatosUsuario {
    idUsuario: number;
    nombre: string;
    fechaNacimiento: string; // Las fechas desde APIs SQL suelen llegar como string ('YYYY-MM-DD')
    correo: string;
    idTipoUsuario: number;
    idGenero: number;
    idIdioma: number;
}
