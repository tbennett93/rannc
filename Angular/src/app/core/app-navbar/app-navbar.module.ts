import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNavbarComponent } from './app-navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import {  RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatMenuModule} from '@angular/material/menu';



@NgModule({
  declarations: [
    AppNavbarComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterModule,
    SharedModule,
    MatMenuModule
  ],
  exports:[
    AppNavbarComponent
  ]
})
export class AppNavbarModule { }
