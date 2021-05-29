import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AppNavbarModule } from './app-navbar/app-navbar.module';


@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule,
    SharedModule,
    AppNavbarModule

  ],
  exports: [
    RouterModule,
    SharedModule,
    AppNavbarModule
  ]
})


export class CoreModule { }
