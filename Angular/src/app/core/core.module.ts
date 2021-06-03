import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AppNavbarModule } from './app-navbar/app-navbar.module';
import { PageTitleBarModule } from './page-title-bar/page-title-bar.module';


@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule,
    SharedModule,
    AppNavbarModule,
    PageTitleBarModule

  ],
  exports: [
    RouterModule,
    SharedModule,
    AppNavbarModule,
    PageTitleBarModule
  ]
})


export class CoreModule { }
