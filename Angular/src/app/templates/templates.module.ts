import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './templates.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { TileListModule } from '../feature-components/tile-list/tile-list.module';



@NgModule({
  declarations: [
    TemplatesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TileListModule,
    RouterModule.forRoot([
      {path: 'templates', component: TemplatesComponent, data : {title:'Templates'}},      
    ], {scrollPositionRestoration: 'enabled'}),
  ],
  exports:[
    TemplatesComponent
  ]
})
export class TemplatesModule { }
