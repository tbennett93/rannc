import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './templates.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    TemplatesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forRoot([
      {path: 'templates', component: TemplatesComponent, data : {title:'Templates'}},      
    ], {scrollPositionRestoration: 'enabled'}),
  ],
  exports:[
    TemplatesComponent
  ]
})
export class TemplatesModule { }
