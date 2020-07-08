import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  userLoggedIn: boolean = false;
  userLogged: Usuario;
  adm: boolean = false;
  adm1: boolean = false;
  inq: boolean = false;
  constructor(private _http: HttpClient) {
    this.refreshPage();
  }

  readonly URL_API = 'http://localhost:3000/api/usuarios/login';

  public getToken(): string {
    return sessionStorage.getItem('token');
  }
  public refreshPage() {
    var bandera = sessionStorage.getItem('Perfil');
    if (bandera == 'Administrador') {
      this.userLogged = JSON.parse(sessionStorage.getItem('userDate'));
      this.adm = true;
      this.userLoggedIn = true;
      console.log(this.adm);
    } else if (bandera == 'Administrativo') {
      this.userLogged = JSON.parse(sessionStorage.getItem('userDate'));
      this.adm1 = true;
      this.userLoggedIn = true;
      console.log(this.adm1);
    } else if (bandera == 'Inquilino') {
      this.userLogged = JSON.parse(sessionStorage.getItem('userDate'));
      this.inq = true;
      this.userLoggedIn = true;
      console.log(this.inq);
    } else {
      this.userLoggedIn = false;
    }
  }
  public login(usuario: string, password: string): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    let body = JSON.stringify({ usuario: usuario, password: password });
    return this._http.post(this.URL_API, body, httpOption);
  }

  public logout() {
    // reseteo las propiedades del service que indican
    // que un usuari esta logueado y cual es el usuario logueado
    this.userLogged = new Usuario();
    this.userLoggedIn = false;
    sessionStorage.removeItem('token');
    sessionStorage.clear();
    sessionStorage.removeItem('userData');
    this.refreshPage();
    location.href = '/home';
  }
}
