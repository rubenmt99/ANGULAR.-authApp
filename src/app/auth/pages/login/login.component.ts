import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent   {

  miFormulario: FormGroup = this.fb.group({
    email: ['test1@test.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]]
  })

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService) { }

  
  login(){

    const {email, password} = this.miFormulario.value;

    this.authService.login( email, password )
      .subscribe(ok => {

        //que el valor del ok sea true, NO que ok exista en el error
        if(ok == true){
          this.router.navigateByUrl('/dashboard');
        }else{
          //mensaje de alerta
          Swal.fire('Error', ok, 'error')
        }
      });
  }

}
