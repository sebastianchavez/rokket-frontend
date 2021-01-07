import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UserService } from 'src/app/services/user.service'
import { LoggerService } from 'src/app/services/logger.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  idLog: string = 'LoginComponent'

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 3000,
    showConfirmButton: false
  })

  loginForm: FormGroup;
  submitted = false;
  btnLoad: Boolean = false;
  
  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private logger: LoggerService) { }

  ngOnInit(): void {
    this.clearForm()
  }

  clearForm(){
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(value) {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.btnLoad = true
    this.userService.login(value).subscribe((res: any) => {
      this.logger.info(this.idLog, 'onSubmit', {info: 'Success', response: res})
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('accessToken', res.accessToken)
      this.btnLoad = false
      this.Toast.fire({icon: 'success', title: 'Usuario logueado con éxito'})
      this.router.navigate([''])
    },err => {
      this.logger.error(this.idLog, 'onSubmit', {info: 'Error', error: err})
      let msg = err.error && err.error.message ? err.error.message : 'Error al ingresar' 
      this.btnLoad = false
      Swal.fire({icon: 'error', title: msg})
    })

  }


}
