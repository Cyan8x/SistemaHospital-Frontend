import { EstadoAtencion } from "./estadoAtencion";
import { Usuario } from "./usuario";

export class Paciente {
  paciente_id: number;
  nombresPaciente: string;
  apellidosPaciente: string;
  tipoDocumento: string;
  dniPaciente: string;
  carneExtranjeria: string;
  direccionPaciente: string;
  emailPaciente: string;
  telefonoPaciente: string;
  esActivo: boolean;
  fechaCreacionPaciente: string;
  esFavorito: boolean;
  estadoAtencion: EstadoAtencion;
  usuario: Usuario;
}
