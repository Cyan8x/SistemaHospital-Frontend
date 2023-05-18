import { EstadoAtencion } from "./estadoAtencion";

export class Paciente {
  paciente_id: number;
  nombresPaciente: string;
  apellidosPaciente: string;
  dniPaciente: string;
  direccionPaciente: string;
  emailPaciente: string;
  telefonoPaciente: string;
  estadoAtencion: EstadoAtencion;
}
