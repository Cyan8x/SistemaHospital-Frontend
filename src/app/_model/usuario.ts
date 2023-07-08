import { Rol } from "./rol";

export class Usuario {
  usuario_id: number;
  usuario: string;
	password: string;
	nombresUsuario: string;
	apellidosUsuario: string;
  dniUsuario: string;
  emailUsuario: string;
  telefonoUsuario: string;
  fechaCreacionUsuario:string;

	esActivoUsuario: boolean;

  rol: Rol;

	esActivoLunes: boolean;
	esActivoMartes: boolean;
	esActivoMiercoles: boolean;
	esActivoJueves: boolean;
	esActivoViernes: boolean;
	esActivoSabado: boolean;
	esActivoDomingo: boolean;

	horaInicioLunes: string;
	horaFinLunes: string;

	horaInicioMartes: string;
	horaFinMartes: string;

	horaInicioMiercoles: string;
	horaFinMiercoles: string;

	horaInicioJueves: string;
	horaFinJueves: string;

	horaInicioViernes: string;
	horaFinViernes: string;

	horaInicioSabado: string;
	horaFinSabado: string;

	horaInicioDomingo: string;
	horaFinDomingo: string;
}
