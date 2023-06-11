import { Paciente } from "./paciente";
import { Usuario } from "./usuario";

export class Comentario {
  comentario_id: number;
  usuario: Usuario;
  paciente: Paciente;
  comentario: string;
  fechaHoraComentario: string;
}
