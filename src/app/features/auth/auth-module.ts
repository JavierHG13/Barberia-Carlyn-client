import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from './login/login';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';
import { AuthRoutingModule } from './auth-routing-module';


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule, Login, Register, ForgotPassword
  ]
})
export class AuthModule { }