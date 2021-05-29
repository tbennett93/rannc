import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';




@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    FlexLayoutModule,
    MatIconModule
  ],
  exports:[
    MatButtonModule,
    MatSnackBarModule,
    FlexLayoutModule,
    MatIconModule
  ]
})
export class SharedModule { }
