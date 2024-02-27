import { Procedimiento } from "./procedimiento";
import { Usuario } from "./usuario";

export class Notificacion{
  notificacion_id: number;
	usuarioOrigen: Usuario;
	usuarioDestino: number;
	procedimiento: Procedimiento;
	causa: string;
	fechaHoraNotificacion:string;
}
