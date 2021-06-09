import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../shared/shared.module';
import {MatFormFieldModule} from '@angular/material/form-field';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot([
      {path: 'login', component: LoginComponent, data : {title:'Login'}},
    ]),
    FormsModule,
    MatInputModule,
    MatCardModule,
    SharedModule,
    MatFormFieldModule
  ],
  exports:[
    LoginComponent
  ]
})
export class LoginModule { }
