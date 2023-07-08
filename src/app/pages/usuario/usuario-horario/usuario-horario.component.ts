import { Component, OnInit, Renderer2 } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MtxDatetimepickerMode, MtxDatetimepickerType } from '@ng-matero/extensions/datetimepicker';
import { switchMap } from 'rxjs';
import { Usuario } from 'src/app/_model/usuario';
import { UsuarioService } from 'src/app/_service/usuario.service';
import * as moment from 'moment';
import { Rol } from 'src/app/_model/rol';
import { RolService } from 'src/app/_service/rol.service';
import { Menu } from 'src/app/_model/menu';
import { MenuService } from 'src/app/_service/menu.service';

@Component({
  selector: 'app-usuario-horario',
  templateUrl: './usuario-horario.component.html',
  styleUrls: ['./usuario-horario.component.css']
})
export class UsuarioHorarioComponent implements OnInit {

  usuario_id: number;
  usuario: Usuario;
  fechaString: string = '2023-06-29';
  roles: Rol[];
  menus: Menu[];

  esActivoLunes: boolean;
  esActivoMartes: boolean;
  esActivoMiercoles: boolean;
  esActivoJueves: boolean;
  esActivoViernes: boolean;
  esActivoSabado: boolean;
  esActivoDomingo: boolean;

  type: MtxDatetimepickerType = 'time';
  mode: MtxDatetimepickerMode = 'auto';

  timeIngresoLunes = new UntypedFormControl();
  timeSalidaLunes = new UntypedFormControl();

  timeIngresoMartes = new UntypedFormControl();
  timeSalidaMartes = new UntypedFormControl();

  timeIngresoMiercoles = new UntypedFormControl();
  timeSalidaMiercoles = new UntypedFormControl();

  timeIngresoJueves = new UntypedFormControl();
  timeSalidaJueves = new UntypedFormControl();

  timeIngresoViernes = new UntypedFormControl();
  timeSalidaViernes = new UntypedFormControl();

  timeIngresoSabado = new UntypedFormControl();
  timeSalidaSabado = new UntypedFormControl();

  timeIngresoDomingo = new UntypedFormControl();
  timeSalidaDomingo = new UntypedFormControl();

  constructor(private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private menuService: MenuService) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.usuario_id = data['id'];
      this.usuarioService.listarPorId(this.usuario_id).subscribe(data => {
        this.usuario = data;

        this.esActivoLunes = data.esActivoLunes;
        this.esActivoMartes = data.esActivoMartes;
        this.esActivoMiercoles = data.esActivoMiercoles;
        this.esActivoJueves = data.esActivoJueves;
        this.esActivoViernes = data.esActivoViernes;
        this.esActivoSabado = data.esActivoSabado;
        this.esActivoDomingo = data.esActivoDomingo;

        this.timeIngresoLunes = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaInicioLunes}`));
        this.timeSalidaLunes = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaFinLunes}`));

        this.timeIngresoMartes = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaInicioMartes}`));
        this.timeSalidaMartes = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaFinMartes}`));


        this.timeIngresoMiercoles = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaInicioMiercoles}`));
        this.timeSalidaMiercoles = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaFinMiercoles}`));

        this.timeIngresoJueves = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaInicioJueves}`));
        this.timeSalidaJueves = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaFinJueves}`));

        this.timeIngresoViernes = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaInicioViernes}`));
        this.timeSalidaViernes = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaFinViernes}`));

        this.timeIngresoSabado = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaInicioSabado}`));
        this.timeSalidaSabado = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaFinSabado}`));

        this.timeIngresoDomingo = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaInicioDomingo}`));
        this.timeSalidaDomingo = new UntypedFormControl(new Date(`${this.fechaString}T${this.usuario.horaFinDomingo}`));

        this.menuService.listarPorUsuario(this.usuario.usuario).subscribe(data =>{
          this.menus = data;
        })
      })
    })
  }

  ngAfterViewInit() {
    this.agregarEstilosDinamicos();
  }

  agregarEstilosDinamicos() {
    const styles = `
      .mtx-calendar{
        background: #fff;
        box-shadow: 7px 9px 13px 4px rgba(0,0,0,0.71);
      }
      .mtx-calendar-header{
        background: #3f48cc;
        color:#fff;
      }
    `;

    const styleElement = this.renderer.createElement('style');
    const styleText = this.renderer.createText(styles);

    this.renderer.appendChild(styleElement, styleText);
    this.renderer.appendChild(document.head, styleElement);
  }

  operar() {
    if (this.esActivoLunes) {
      this.usuario.esActivoLunes = this.esActivoLunes;
      this.usuario.horaInicioLunes = moment(this.timeIngresoLunes.value).format('HH:mm:ss');
      this.usuario.horaFinLunes = moment(this.timeSalidaLunes.value).format('HH:mm:ss');
    } else {
      this.usuario.esActivoLunes = this.esActivoLunes;
    }

    if (this.esActivoMartes) {
      this.usuario.esActivoMartes = this.esActivoMartes;
      this.usuario.horaInicioMartes = moment(this.timeIngresoMartes.value).format('HH:mm:ss');
      this.usuario.horaFinMartes = moment(this.timeSalidaMartes.value).format('HH:mm:ss');
    } else {
      this.usuario.esActivoMartes = this.esActivoMartes;
    }

    if (this.esActivoMiercoles) {
      this.usuario.esActivoMiercoles = this.esActivoMiercoles;
      this.usuario.horaInicioMiercoles = moment(this.timeIngresoMiercoles.value).format('HH:mm:ss');
      this.usuario.horaFinMiercoles = moment(this.timeSalidaMiercoles.value).format('HH:mm:ss');
    } else {
      this.usuario.esActivoMiercoles = this.esActivoMiercoles;
    }

    if (this.esActivoJueves) {
      this.usuario.esActivoJueves = this.esActivoJueves;
      this.usuario.horaInicioJueves = moment(this.timeIngresoJueves.value).format('HH:mm:ss');
      this.usuario.horaFinJueves = moment(this.timeSalidaJueves.value).format('HH:mm:ss');
    } else {
      this.usuario.esActivoJueves = this.esActivoJueves;
    }

    if (this.esActivoViernes) {
      this.usuario.esActivoViernes = this.esActivoViernes;
      this.usuario.horaInicioViernes = moment(this.timeIngresoViernes.value).format('HH:mm:ss');
      this.usuario.horaFinViernes = moment(this.timeSalidaViernes.value).format('HH:mm:ss');
    } else {
      this.usuario.esActivoViernes = this.esActivoViernes;
    }

    if (this.esActivoSabado) {
      this.usuario.esActivoSabado = this.esActivoSabado;
      this.usuario.horaInicioSabado = moment(this.timeIngresoSabado.value).format('HH:mm:ss');
      this.usuario.horaFinSabado = moment(this.timeSalidaSabado.value).format('HH:mm:ss');
    } else {
      this.usuario.esActivoSabado = this.esActivoSabado;
    }

    if (this.esActivoDomingo) {
      this.usuario.esActivoDomingo = this.esActivoDomingo;
      this.usuario.horaInicioDomingo = moment(this.timeIngresoDomingo.value).format('HH:mm:ss');
      this.usuario.horaFinDomingo = moment(this.timeSalidaDomingo.value).format('HH:mm:ss');
    } else {
      this.usuario.esActivoDomingo = this.esActivoDomingo;
    }

    this.usuarioService
      .modificar(this.usuario)
      .pipe(
        switchMap(() => {
          return this.usuarioService.listar();
        })
      )
      .subscribe((data) => {
        this.usuarioService.setUsuarioCambio(data);
        this.usuarioService.setMensajeCambio('Se modificó.');
        this.menuService.asignarMenusUsuario(this.usuario.usuario_id,this.menus).subscribe(data=>{
        });
      });

      this.router.navigate(['/pages/usuario'])
  }

}
