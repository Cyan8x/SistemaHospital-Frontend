import { EstadoAsistencia } from "./EstadoAsistencia";
import { Usuario } from "./usuario";

export class Asistencia{
  asistencia_id: number;
  usuario: Usuario;
  fechaHoraAsistencia: string;
  justificacionTardanza: string;
  estadoAsistencia: EstadoAsistencia;
}
