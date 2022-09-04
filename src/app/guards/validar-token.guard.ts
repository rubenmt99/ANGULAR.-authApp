import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate, CanLoad {


  //declarado en el appRouting en el dashBoard

  constructor(private authService: AuthService,
              private router: Router){}

  canActivate(): Observable<boolean> | boolean{
    console.log('canActivate');
    return this.authService.validarToken()
          .pipe(
            tap(valid => {
              console.log(valid);
              if(!valid){
                this.router.navigateByUrl('/auth');
              }
            })
          );
  }
  canLoad(): Observable<boolean> | boolean{
    console.log('canLoad');
    return this.authService.validarToken()
        .pipe(
          tap(valid => {
            console.log(valid);
            if(!valid){
              this.router.navigateByUrl('/auth');
            }
          })
        );
  }
}
