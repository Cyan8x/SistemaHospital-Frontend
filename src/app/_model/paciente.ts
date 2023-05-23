import { EstadoAtencion } from "./estadoAtencion";
import { Usuario } from "./usuario";

export class Paciente {
  paciente_id: number;
  nombresPaciente: string;
  apellidosPaciente: string;
  dniPaciente: string;
  direccionPaciente: string;
  emailPaciente: string;
  telefonoPaciente: string;
  esActivo: boolean;
  esFavorito: boolean;
  estadoAtencion: EstadoAtencion;
  usuario: Usuario;
}
