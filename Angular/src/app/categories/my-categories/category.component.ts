import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryModel } from 'src/app/models/category.model';
import { DataService } from 'src/app/services/data.service';
import { TokenService } from 'src/app/services/token.service';

export class Tile {
  colour: string;
  cols: number;
  rows: number;
  text: string;
  id: string;
}

export interface Color{
  colour: string;
}

export class RowsColumns{
  rows: number;
  columns: number;
}

@Component({
  templateUrl: './category.component.html',
  selector: 'categories',
  styleUrls: ['./category.component.css']
})




export class CategoryComponent implements OnInit, OnDestroy {

  title = 'Rannc';
  category: CategoryModel[];
  getLoaded: boolean;

  colours: Color[] = [
    {colour: '#ffadad' },
    {colour: '#ffd6a5' },
    {colour: '#fdffb6' },
    {colour: '#caffbf' },
    {colour: '#9bf6ff' },
    {colour: '#a0c4ff' },
    {colour: '#bdb2ff' },
    {colour: '#ffc6ff' }
  ];



  tiles: Tile[] = new Array<Tile>();
 
  colourIndex: number = 0;

  
  getFullBlocksRowAndColumns(amount: number, remainder: number){
    let rowsColumns = new Array<RowsColumns>();
    console.log('whole');
    console.log(amount);

    console.log('remainder');
    console.log(remainder);

    let flip: boolean = false;

    //full block
    for (let index = 0; index < amount; index++) {
      if(!flip){
        rowsColumns = rowsColumns.concat([
          {rows:1, columns:2},
          {rows:2, columns:2},
          {rows:1, columns:1},
          {rows:1, columns:1}          
        ])
      }
      else{
        rowsColumns = rowsColumns.concat([
          {rows:2, columns:2},
          {rows:1, columns:2},
          {rows:1, columns:1},
          {rows:1, columns:1}          
        ])        
      }  
      flip = !flip;
    }


    //partial block
    switch(remainder) { 
      case 1: { 
         //statements; 
         rowsColumns = rowsColumns.concat( [
           {rows:1, columns:4}
         ])
         break; 
      } 
      case 2: { 
        rowsColumns = rowsColumns.concat([
          {rows:1, columns:2},
          {rows:1, columns:2}
        ]);
         break; 
      } 
      case 3: { 
        if(!flip){
          rowsColumns = rowsColumns.concat([
            {rows:1, columns:3},
            {rows:2, columns:1},
            {rows:1, columns:3}
          ]);
        }
        else{
          rowsColumns = rowsColumns.concat([
            {rows:2, columns:1},
            {rows:1, columns:3},
            {rows:1, columns:3}
          ]);
        }
         break; 
      } 
   } 
   console.log('getFullBlocksRowAndColumns rowsColumns');
   console.log(rowsColumns);
    return rowsColumns;
  }
  calculateTileRowsAndColumns() : RowsColumns[]{
    let arrayLength: number  = this.category.length;
    
    let fullBlocks: number = Math.floor(arrayLength/4);
    let partialBlocks: number = arrayLength%4;

    let rowsColumns : RowsColumns[];
    
    rowsColumns = this.getFullBlocksRowAndColumns(fullBlocks, partialBlocks);

    console.log('arraykrngth');
    console.log(arrayLength);

   //TODO when over 4 in length, repeat, but mirror
    return rowsColumns;
  }

  getTileColour(){
    let colour: string =  this.colours[this.colourIndex].colour;
    this.colourIndex++;
    if (this.colourIndex >= this.colours.length){
      this.colourIndex = 0;
    }
    return colour;
  }

  populateTileArray(){

    let rowsAndColumns : RowsColumns[] = this.calculateTileRowsAndColumns();
    console.log('rowsAndColumns');
    console.log(rowsAndColumns);
    this.category.forEach((cat, index) => {
      console.log(cat.name);
      let tile : Tile = new Tile();
      tile.id = cat.id;
      tile.text = cat.name;
      tile.colour = this.getTileColour();
      tile.rows = rowsAndColumns[index].rows;
      tile.cols = rowsAndColumns[index].columns;
      console.log(tile);
      this.tiles.push(tile)
    });

  }
  constructor(private data: DataService, private tokenService: TokenService, private _snackBar: MatSnackBar) { };

  ngOnInit(): void {
    if (this.isUserAuthenticated && this.tokenService.isAccessTokenValid()) {
      this.data.getCategories().subscribe({
        next: (data: CategoryModel[]) => {
          this.category = data;
          console.log(data);
          this.populateTileArray();
          this.getLoaded = true;
        },
        error: () => {
          console.log("error in getCategoriesObserver");
          this.openSnackBar('Error getting your data. Please try again later.');
        }
      });
    }
  };

  ngOnDestroy(): void{

  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'close', {
      duration: 3000
    });
  }
  
  isUserAuthenticated() {
    const token: string = localStorage.getItem("jwt");
    if (token) { return true; }
    else { return false; }
  }


  addNew(inputField) {
    // console.log(inputField.value);
    let categoryModel = new CategoryModel;
    let name = inputField.value;

    if (!name) {
      this.openSnackBar('Enter a category name');
      return null;
    }


    if (this.tokenService.isAccessTokenValid()) {
      categoryModel.name = name;
      this.data.postCategory(categoryModel).subscribe({
        next: (resp: CategoryModel) => {
          this.category.push(resp);
          inputField.value = '';
          this.populateTileArray();
        },
        error: err => {
          console.log(err);
          this.openSnackBar('Error adding a new category. Please try again later.');
        }
      });
    }


  }

  deleteCategory(id: string, index) {
    if (confirm("Are you sure you want to delete this category and all contents?")) {

      if (this.tokenService.isAccessTokenValid()) {

        console.log('deleting - ' + id);
        this.data.deleteCategory(id).subscribe({
          next: resp => this.category.splice(index, 1),
          error: err => {
            console.log(err);
            this.openSnackBar('Error deleting category. Please try again later.');
          }
        })
      }
    }
  }
}
