import { Paciente } from "./paciente";
import { Usuario } from "./usuario";

export class Notificacion{
  notificacion_id: number;
	usuarioOrigen: Usuario;
	usuarioDestino: number;
	paciente: Paciente;
	causa: string;
	fechaHoraNotificacion:string;
}
