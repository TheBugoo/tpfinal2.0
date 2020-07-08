import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Local } from '../../models/locl';
import { LocalesService } from '../../services/locales.service';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import * as printJS from 'print-js';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as $ from 'jquery';
import { NgForm } from '@angular/forms';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
(window as any).html2canvas = html2canvas;

@Component({
  selector: 'app-locales',
  templateUrl: './locales.component.html',
  styleUrls: ['./locales.component.css'],
})
export class LocalesComponent implements OnInit {
  @ViewChild('content') content: ElementRef;
  locl: Local;
  locales: Array<Local>;
  convertido: string;

  constructor(
    private localService: LocalesService,
    private _toastr: ToastrService,
    public loginService: LoginService
  ) {
    this.locl = new Local();
    this.locales = new Array<Local>();
    this.refrescarLocales();
  }

  ngOnInit(): void {
    console.log(this.locl.alquilado);
  }
  public printJS() {
    printJS('printJS-form', 'html');
  }

  public generarPDF() {
    let doc = new jspdf();
    doc.addHTML(document.getElementById('content')).then(() => {
      doc.save('Locales.pdf');
    });
  }

  refrescarLocales() {
    this.locl = new Local();
    this.locales = new Array<Local>();
    this.localService.getLocales().subscribe(
      (result) => {
        result.forEach((element) => {
          Object.assign(this.locl, element);
          this.locales.push(this.locl);
          this.locl = new Local();
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  guardarLocal() {
    this.locl.imagen = this.convertido;
    this.localService.addLocal(this.locl).subscribe(
      (result) => {
        console.log(result);
        this.refrescarLocales();
        this._toastr.success('Local guardado', 'Exito');
      },
      (error) => {
        this._toastr.error(error, 'Error');
      }
    );
    this.locl = new Local();
  }

  borrarLocal(id: string) {
    this.localService.deleteLocal(id).subscribe(
      (result) => {
        this._toastr.success('Local eliminado', 'Exito');
        this.refrescarLocales();
      },
      (error) => {
        this._toastr.error(error, 'Error');
      }
    );
    this.locl = new Local();
  }

  modificarLocal() {
    this.localService.updateLocal(this.locl).subscribe(
      (result) => {
        this._toastr.success('Local modificado', 'Exito');
        this.refrescarLocales();
        this.locl = new Local();
      },
      (error) => {
        this._toastr.error(error, 'Error');
      }
    );
  }

  limpiar() {
    this.locl = new Local();
  }

  elegirLocal(local: Local) {
    var tlocal = new Local();
    Object.assign(tlocal, local);
    this.locl = tlocal;
  }
  public onSubmit(form: NgForm) {
    form.resetForm();
  }
  convertir(files) {
    if (files != null) {
      console.log('Archivo cambiado..', files);
      this.convertido = files[0].base64;
    } else {
      console.log('error');
    }
  }
  /*  public pdf() {
    let doc = new jsPDF();
    doc.addHTML(this.content.nativeElement, function () {
      doc.save('Locales.pdf');
    });
  } */
}
