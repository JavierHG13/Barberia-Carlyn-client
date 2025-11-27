import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from './login/login.component';
import { Register } from './register/register';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-code/verify-code.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyRecoveryCodeComponent } from './verify-recovery-code/verify-recovery-code.component';
import { AuthRoutingModule } from './auth-routing-module';
import { GoogleLoginComponent } from '../../shared/components/google-login.component';


@NgModule({
  imports: [
    CommonModule, GoogleLoginComponent,
    AuthRoutingModule, Login, Register, ForgotPasswordComponent, ResetPasswordComponent, VerifyEmailComponent, VerifyRecoveryCodeComponent
  ]
})
export class AuthModule { }