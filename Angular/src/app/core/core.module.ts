import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AppNavbarComponent
  ],
  imports: [
    RouterModule,
    MatToolbarModule,
    SharedModule

  ],
  exports: [
    AppNavbarComponent
  ]
})


export class CoreModule { }
