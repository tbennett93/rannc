import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryComponent } from './category.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { TileListModule } from 'src/app/feature-components/tile-list/tile-list.module';



@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TileListModule,
    RouterModule.forRoot([
      {path: 'my-categories', component: CategoryComponent, canActivate: [AuthGuard], data : {title:'My Categories'}}
    ]),
  ],
  exports:[
    CategoryComponent
  ]
})
export class CategoryModule { }
