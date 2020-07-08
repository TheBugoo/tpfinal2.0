import { Component, OnInit } from '@angular/core';
import { Novedad } from './../../models/novedad';
import { NovedadService } from 'src/app/services/novedad.service';
import { LoginService } from 'src/app/services/login.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as printJS from 'print-js';
import jsPDF from 'jspdf';
import * as $ from 'jquery';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css'],
})
export class NovedadesComponent implements OnInit {
  novedad: Novedad;
  novedades: Array<Novedad>;
  filtro1: boolean;

  constructor(
    private novedadService: NovedadService,
    public loginService: LoginService,
    private toastrService: ToastrService
  ) {
    this.novedad = new Novedad();
    this.novedades = new Array<Novedad>();

    if (this.filtro1 == true) {
      this.obtenerNovedad();
    } else {
      this.obtenerNovedadPendiente();
    }
  }

  filtrar() {
    console.log(this.filtro1);
    if (this.filtro1 == true) {
      this.obtenerNovedad();
      this.toastrService.success('...', 'Exito');
    } else {
      this.obtenerNovedadPendiente();
    }
  }

  enviarNovedad() {
    this.novedadService.addNovedad(this.novedad).subscribe(
      (result) => {
        this.toastrService.success('Novedad Enviada', 'Exito');

        this.obtenerNovedad();
      },
      (error) => {
        console.log('Error');
      }
    );

    this.obtenerNovedad();
    this.novedad = new Novedad();
  }
  guardarNovedad() {
    this.novedad.estado = 'Pendiente';

    this.novedad.usuario = this.loginService.userLogged;
    this.novedadService.addNovedad(this.novedad).subscribe(
      (result) => {
        this.toastrService.success('Novedad Enviada', 'Exito');
      },
      (error) => {
        this.toastrService.error(
          'Se esta trabajando en ello , vuelva pronto',
          'Error'
        );
      }
    );

    this.novedad = new Novedad();
  }
  borrarNovedad(nov: Novedad) {
    this.novedadService.deleteNovedad(nov).subscribe(
      (result) => {
        this.toastrService.success('Novedad Eliminada', 'Exito');
        this.obtenerNovedad();
      },
      (error) => {
        this.toastrService.error('Se esta trabajando en ello', 'Error');
      }
    );
    this.obtenerNovedad();
  }
  obtenerNovedadPendiente() {
    //this.asistentes = this.asistenteService.getAsistente();
    this.novedades = new Array<Novedad>();
    var nov: Novedad = new Novedad();
    this.novedadService.getNovedadPendiente().subscribe(
      (result) => {
        result.forEach((element) => {
          Object.assign(nov, element);
          this.novedades.push(nov);
          nov = new Novedad();
        });
      },
      (error) => {
        this.toastrService.error('Se esta trabajando en ello Novedad', 'Error');
      }
    );
  }
  obtenerNovedad() {
    //this.asistentes = this.asistenteService.getAsistente();
    this.novedades = new Array<Novedad>();
    var nov: Novedad = new Novedad();
    this.novedadService.getNovedad().subscribe(
      (result) => {
        result.forEach((element) => {
          Object.assign(nov, element);

          this.novedades.push(nov);
          nov = new Novedad();
        });
      },
      (error) => {
        this.toastrService.error('Se esta trabajando en ello Novedad', 'Error');
      }
    );
  }

  modificarNovedad(item: Novedad) {
    this.novedad = item;
    this.novedad.estado = 'Procesado';
    this.novedadService.upDateNovedad(this.novedad).subscribe(
      (result) => {
        this.toastrService.success('Novedad Procesada', 'Exito');
        this.obtenerNovedadPendiente();
      },
      (error) => {
        this.toastrService.error(
          'Se esta trabajando en ello , vuelva pronto',
          'Error'
        );
      }
    );

    this.novedad = new Novedad();
  }
  limpiarNovedad() {
    this.novedad = new Novedad();
  }
  elegirNovedad(nov: Novedad) {
    console.log(nov);
    this.novedad = nov;
  }
  public onSubmit(form: NgForm) {
    form.resetForm();
  }
  ngOnInit(): void {
    this.novedad.usuario = this.loginService.userLogged;
    console.log(this.novedad.usuario);
  }
  public printJS() {
    printJS('printJS-form', 'html');
  }
  public generarPDF() {
    var doc = new jsPDF({
      orientation: '1',
      unit: 'pt',
      format: 'carta',
      posicicion: 1,
    });
    doc.text('NOVEDADES', 90, 15);
    doc.setFontSize(10);
    doc.setFontStyle('cursiva');
    doc.fromHTML($('#printJS-form').get(0), 35, 25);
    doc.save('novedades table pdf');
  }
}
