import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot([
      {path: 'home', component: HomeComponent, data : {title:'Home'}}
    ]),
    MatCardModule,
    SharedModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
