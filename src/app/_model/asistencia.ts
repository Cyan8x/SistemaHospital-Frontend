import { EstadoAsistencia } from "./estadoAsistencia";
import { Usuario } from "./usuario";

export class Asistencia {
  asistencia_id: number;
  usuario: Usuario;
  fechaAsistencia: string;
  fechaHoraAsistencia: string;
  justificacionTardanza: string;
  estadoAsistencia: EstadoAsistencia;
}
