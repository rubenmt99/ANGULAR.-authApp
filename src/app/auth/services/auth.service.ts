import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //que no se importe del env de prod
  private baseUrl: string = environment.baseUrl;
  private _usuario !: Usuario;

  get usuario(){
    return {...this._usuario};
  }

  constructor(private http: HttpClient) { }



  registro( name: string, email: string, password: string){

    const url = `${this.baseUrl}/auth/new`;
    const body = { name, email, password };

    return this.http.post<AuthResponse>(url,body)
      .pipe(
        tap(resp => {
          console.log(resp);
          if(resp.ok){
            localStorage.setItem('token', resp.token!);
          }
        }),
        map(resp => resp.ok),
        catchError(err => of(err.error.msg))
      );
  }




  login( email: string, password: string){

    const url = `${this.baseUrl}/auth`;
    const body = { email, password };

    /*para que una peticion, un observable se dispare nos tenemos que
     suscribir, lo haremos en el login.components
     catchError para obtener el error que nos de el backend por ej. 404
     y que devuelva otra cosa como un false, pero ese false tiene que ser
     un observable, debemos devolver observable.*/
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(resp => {
          if(resp.ok){
            localStorage.setItem('token',resp.token!)
          }
        }),
        map(resp => resp.ok),
        catchError(err => of(err.error.msg))
      );
  }



  
  validarToken(): Observable<boolean>{

    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '')

    return this.http.get<AuthResponse>(url, {headers})
      .pipe(
        map( resp => {

          console.log(resp);

          localStorage.setItem('token',resp.token!)
            this._usuario = {
              name: resp.name!,
              uid: resp.uid!,
              email: resp.email!
            }

          return resp.ok;
        }),
        catchError(err => of(false))
      );
  }


  

  logout(){
    localStorage.clear();
  }




}
