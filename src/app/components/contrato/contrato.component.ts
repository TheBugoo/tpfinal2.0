import { Component, OnInit } from '@angular/core';
import { Contrato } from './../../models/contrato';
import { Local } from './../../models/locl';
import { ContratoService } from './../../services/contrato.service';
import { LocalesService } from './../../services/locales.service';
import { PropietarioService } from './../../services/propietario.service';
import { NgForm } from '@angular/forms';
import { Propietario } from 'src/app/models/propietario';
import { LoginService } from 'src/app/services/login.service';
import { ToastrService } from 'ngx-toastr';
import * as printJS from 'print-js';
import jsPDF from 'jspdf';
import * as $ from 'jquery';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css'],
})
export class ContratoComponent implements OnInit {
  local: Local;
  locales: Array<Local>;
  contrato: Contrato;
  contratos: Array<Contrato>;
  propietario: Propietario;
  propietarios: Array<Propietario>;
  localesM: Array<Local>;
  a: number;
  tabla: boolean;
  contador: number;
  validador: boolean;

  val: boolean; // desc: Array<string>;

  constructor(
    private contratoService: ContratoService,
    private propietarioService: PropietarioService,
    private localService: LocalesService,
    private _toastr: ToastrService,
    public loginService: LoginService
  ) {
    this.obtenerPropietario();
    this.obtenerLocal();
    this.obtenerContrato();

    this.contrato = new Contrato();
    this.contratos = new Array<Contrato>();
    this.locales = new Array<Local>();
    this.local = new Local();
    this.propietario = new Propietario();
    this.propietarios = new Array<Propietario>();
    this.localesM = new Array<Local>();
    this.contrato.fecha = new Date();
    this.contrato.costoTotalAlq = 0;
    this.validarIngreso();
  }

  obtenerPropietario() {
    //this.asistentes = this.asistenteService.getAsistente();
    this.propietarios = new Array<Propietario>();
    var prop: Propietario = new Propietario();
    this.propietarioService.getPropietario().subscribe(
      (result) => {
        result.forEach((element) => {
          Object.assign(prop, element);
          this.propietarios.push(prop);
          prop = new Propietario();
        });
      },
      (error) => {
        console.log('Error');
      }
    );
  }
  // obtenerTabla(){
  //   this.contador=0;
  //   for (let contrato of this.contratos){
  //     console.log("entrou");
  //     this.contador=this.contador+1;
  //   }
  //   if (this.contador > 0) {
  //     this.tabla=true;
  //     console.log(this.tabla);// array exists and is not empty
  //   }
  //   else{
  //     this.tabla=false;
  //   }
  // }
  obtenerLocal() {
    //this.asistentes = this.asistenteService.getAsistente();
    this.locales = new Array<Local>();
    var loc: Local = new Local();
    this.localService.getLocalesHabilitados().subscribe(
      (result) => {
        result.forEach((element) => {
          Object.assign(loc, element);
          this.locales.push(loc);
          loc = new Local();
        });
      },
      (error) => {
        console.log('Error');
      }
    );
  }

  cargarModal(contrato: Contrato) {
    this.localesM = contrato.locales;
  }
  eliminarLocales(locall: Local) {
    var index = this.contrato.locales.findIndex(
      (element) => element._id == locall._id
    );
    this.contrato.locales.splice(index, 1);
    locall.alquilado = false;
    console.log(this.contrato.locales);
    if (this.contrato.costoTotalAlq - locall.costoMes >= 0) {
      this.contrato.costoTotalAlq =
        this.contrato.costoTotalAlq - locall.costoMes;
    } else {
      this.contrato.costoTotalAlq = 0;
    }
    this.localService.updateLocal(locall).subscribe(
      (result) => {
        this._toastr.success('Local eliminado de la Lista', 'Exito');
        this.obtenerLocal();
      },
      (error) => {
        console.log('Error');
      }
    );
  }
  // enviarContrato() {
  //   this.validarIngreso();
  //   this.contrato.fecha = new Date();
  //   if(this.validador==true){
  //   this.contratoService.addContrato(this.contrato).subscribe(
  //     (result) => {
  //       this._toastr.success("Contrato agregado","Exito");
  //       this.obtenerContrato();
  //       // this.obtenerTabla();
  //     },
  //     (error) => {
  //       console.log("Error");
  //     }
  //   )
  //   }
  //   else
  //   {
  //     this._toastr.error("Error", "Debe llenar todos los campos para agregar un contrato")
  //     this.contrato.locales.forEach(element => element.alquilado=false);
  //   //con.locales.forEach(element => this.localService.updateLocal(element));
  //     for (let local of this.contrato.locales){
  //     console.log("entrou")
  //     this.localService.updateLocal(local).subscribe(
  //       (result) => {
  //         this._toastr.success("Estado de local actualizado","Exito");
  //         this.obtenerLocal();
  //       },
  //       (error) => {
  //         console.log("Error");
  //       }
  //     );
  //     }
  //   }
  //   this.contrato = new Contrato();
  //   this.contrato.costoTotalAlq=0;
  // }

  enviarContrato() {
    this.validarIngreso();
    this.contrato.fecha = new Date();
    // for (let l of this.contrato.locales){
    //   l.alquilado=true;
    //   this.localService.updateLocal(l).subscribe(
    //     (result) => {
    //       this._toastr.success("Estado de local actualizado","Exito");
    //       this.obtenerLocal();
    //     },
    //     (error) => {
    //       console.log("Error");
    //     }
    //   );
    //   }
    if (this.validador == true) {
      for (let l of this.contrato.locales) {
        l.alquilado = true;
        this.localService.updateLocal(l).subscribe(
          (result) => {
            this._toastr.success('Estado de local actualizado', 'Exito');
          },
          (error) => {
            console.log('Error');
          }
        );
      }
      this.contratoService.addContrato(this.contrato).subscribe(
        (result) => {
          this._toastr.success('Contrato agregado', 'Exito');
          this.obtenerContrato();
          this.obtenerLocal();
          // this.obtenerTabla();
        },
        (error) => {
          console.log('Error');
        }
      );
    } else {
      this._toastr.error(
        'Error',
        'Debe llenar todos los campos para agregar un contrato'
      );
      this.contrato.locales.forEach((element) => (element.alquilado = false));
      //con.locales.forEach(element => this.localService.updateLocal(element));
      // for (let local of this.contrato.locales){
      // console.log("entrou")
      // this.localService.updateLocal(local).subscribe(
      //   (result) => {
      //     this._toastr.success("Estado de local actualizado","Exito");
      //     this.obtenerLocal();
      //   },
      //   (error) => {
      //     console.log("Error");
      //   }
      // );
      // }
    }
    this.contrato = new Contrato();
    this.contrato.costoTotalAlq = 0;
  }

  guardarContrato() {
    this.contrato.fecha = new Date();
    this.contratoService.addContrato(this.contrato);
    this.contrato = new Contrato();
    this.obtenerContrato();
  }
  updateList() {
    this.obtenerContrato();
    this.obtenerLocal();
  }
  borrarContrato(con: Contrato) {
    console.log(con.locales);
    con.locales.forEach((element) => (element.alquilado = false));
    //con.locales.forEach(element => this.localService.updateLocal(element));
    for (let local of con.locales) {
      console.log('entrou');
      this.localService.updateLocal(local).subscribe(
        (result) => {
          this._toastr.success('Estado de local actualizado', 'Exito');
        },
        (error) => {
          console.log('Error');
        }
      );
    }
    this.contrato.costoTotalAlq = 0;
    this.contrato.locales = new Array<Local>();
    this.contratoService.deleteContrato(con).subscribe(
      (result) => {
        this._toastr.success('Contrato Eliminado', 'Exito');
        this.obtenerLocal();
        this.obtenerContrato();
        // this.obtenerTabla();
      },
      (error) => {
        console.log('Error');
      }
    );
  }
  obtenerContrato() {
    //this.asistentes = this.asistenteService.getAsistente();
    this.contratos = new Array<Contrato>();
    var con: Contrato = new Contrato();
    this.contratoService.getContrato().subscribe(
      (result) => {
        result.forEach((element) => {
          Object.assign(con, element);
          this.contratos.push(con);
          con = new Contrato();
        });
      },
      (error) => {
        console.log('Error');
      }
    );
  }
  // guardarLocal() {
  //   if (this.local.alquilado==false) {
  //     this.contrato.locales.push(this.local);
  //     this.local.alquilado=true;
  //     console.log(this.local);
  //     this.localService.updateLocal(this.local).subscribe(

  //       (result) => {
  //         this._toastr.success("Local Agregado","Exito");
  //         this.obtenerLocal();

  //       },
  //       (error) => {
  //         console.log("Error");

  //       }
  //     )
  //     this.a= Number(this.contrato.costoTotalAlq);
  //     this.contrato.costoTotalAlq=this.a+this.local.costoMes;
  //     this.local=new Local();
  //   }
  //   else {
  //     this._toastr.error("error", "El local ya esta alquilado")
  //   }
  // }

  guardarLocal() {
    this.val = false;
    if (this.contrato.locales.length != 0) {
      for (let l of this.contrato.locales) {
        if (this.local._id == l._id) {
          this.val = true;
          console.log('entrou');
        }
      }
      if (this.val == false) {
        if (this.local.superficie != null) {
          this.contrato.locales.push(this.local);
          this.a = Number(this.contrato.costoTotalAlq);
          this.contrato.costoTotalAlq = this.a + this.local.costoMes;
          this.local = new Local();
          this._toastr.success('Local agregado', 'Exito');
        } else {
          this._toastr.error('error', 'Debe seleccionar un local');
        }
      } else {
        this._toastr.error('error', 'El local ya esta agregado');
      }
    } else {
      if (this.local.superficie != null) {
        this.contrato.locales.push(this.local);
        this.a = Number(this.contrato.costoTotalAlq);
        this.contrato.costoTotalAlq = this.a + this.local.costoMes;
        this.local = new Local();
        console.log('entroufora');
        console.log(this.contrato.locales.length);
      } else {
        this._toastr.error('error', 'Debe seleccionar un local');
      }
    }
  }

  modificarContrato() {
    this.validarIngreso();
    console.log(this.contrato.locales);
    this.contrato.fecha = new Date();
    if (this.validador == true) {
      for (let l of this.contrato.locales) {
        l.alquilado = true;
        this.localService.updateLocal(l).subscribe(
          (result) => {
            this._toastr.success('Estado de local actualizado', 'Exito');
          },
          (error) => {
            console.log('Error');
          }
        );
      }
      this.contratoService.upDateMensaje(this.contrato).subscribe(
        (result) => {
          this._toastr.success('Contrato modificado', 'Exito');
          this.obtenerContrato();
          this.obtenerLocal();
        },
        (error) => {
          console.log('Error');
        }
      );
    } else {
      this._toastr.error(
        'Error',
        'Debe llenar todos los campos para modificar un contrato'
      );
      //   this.contrato.locales.forEach(element => element.alquilado=false);
      // //con.locales.forEach(element => this.localService.updateLocal(element));
      //   for (let local of this.contrato.locales){
      //   console.log("entrou")
      //   this.localService.updateLocal(local).subscribe(
      //     (result) => {
      //       this._toastr.success("Estado de local actualizado","Exito");
      //       this.obtenerLocal();
      //     },
      //     (error) => {
      //       console.log("Error");
      //     }
      //   );
      //   }
    }
    this.contrato = new Contrato();
    this.contrato.costoTotalAlq = 0;
    this.contrato.fecha = new Date();
  }
  limpiarContrato() {
    this.contrato = new Contrato();
  }
  listarContratos() {
    this.obtenerContrato();
  }
  elegirContrato(con: Contrato) {
    this.contrato = con;

    console.log(this.contrato.propietario.apellido);
    console.log(this.contrato.fecha);
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  //   chequearContratosFantasmas(){
  //     for (let local of this.locales){
  //       if(local.alquilado==true){
  //         for (let contrato of this.contratos){
  //           for (let locall of contrato.locales){
  //             if (locall.descripcion==local.descripcion){

  //           }
  //       }
  //     }
  //   }
  // }

  //     //con.locales.forEach(element => this.localService.updateLocal(element));
  //     for (let contrato of this.contratos){
  //       for (let local of contrato.locales){
  //         for (let locall of this.locales){
  //             if(locall.alquilado==true&&local._id!=locall._id){
  //               locall.alquilado=false;
  //               console.log("entro")
  //               this.localService.updateLocal(locall).subscribe(
  //                 (result) => {
  //                   this._toastr.success("Se eliminaron contratos fantasmas","Exito");
  //                   this.obtenerLocal();
  //                 },
  //                 (error) => {
  //                   console.log("Error");
  //                 }
  //               );
  //             }
  //         }
  //       }
  //     }

  //     }

  onSubmit(form: NgForm) {
    form.resetForm();
  }
  validarIngreso() {
    if (this.contrato.costoTotalAlq != 0 && this.contrato.propietario != null) {
      this.validador = true;
      console.log('entro');
    } else {
      this.validador = false;
    }
  }

  ngOnInit(): void {}

  public printJS() {
    printJS('printJS-form', 'html');
  }

  public generarPDF() {
    var doc = new jsPDF({
      orientation: '1',
      unit: 'pt',
      format: 'carta',
      posicicion: 5,
    });
    doc.text('CONTRATOS', 90, 18);
    doc.setFontSize(21);
    doc.setFontStyle('cursiva');
    doc.fromHTML($('#printJS-form').get(0), 35, 25);
    doc.save('Contratos table pdf');
  }
}
