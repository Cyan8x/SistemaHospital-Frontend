import { Paciente } from "./paciente";
import { Usuario } from "./usuario";

export class Procedimiento {
  procedimiento_id: number;
  usuario: Usuario;
  paciente: Paciente;
  procedimiento: string;
  es_terminado: boolean;
  usuario_creador: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
}
