import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileListComponent } from './tile-list.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [TileListComponent],
  imports: [
    CommonModule ,
    MatGridListModule,
    RouterModule
  ],
  exports: [TileListComponent]
})
export class TileListModule { 

 

  
}
