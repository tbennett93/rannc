import { Component, Input, IterableDiffers, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Color, Tile, RowsColumns } from 'src/app/categories/my-categories/category.component';
import { CategoryModel } from 'src/app/models/category.model';
import { DataService } from 'src/app/services/data.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-tile-list',
  templateUrl: './tile-list.component.html',
  styleUrls: ['./tile-list.component.scss']
})
export class TileListComponent implements OnInit {

  @Input() category: CategoryModel[];
  differ: any;

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

  newCategoryColour : Color = {colour:'#ffc6ff'};
  tiles: Tile[] = new Array<Tile>();
  colourIndex: number = 0;
  
  constructor(private data: DataService, private tokenService: TokenService, private _snackBar: MatSnackBar, differs: IterableDiffers) {
    this.differ = differs.find([]).create(null);

   };

   ngDoCheck() {
    // const change = this.differ.diff(this.category);
    // console.log(change);
    if(this.getLoaded){
      this.tiles=[];
      this.populateTileArray();
    }
    // here you can do what you want on array change
    // you can check for forEachAddedItem or forEachRemovedItem on change object to see the added/removed items
    // Attention: ngDoCheck() is triggered at each binded variable on componenet; if you have more than one in your component, make sure you filter here the one you want.
  }

  ngOnInit(): void {
    this.getLoaded = true;
  };
  
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
  

  ngOnDestroy(): void{

  }

  openSnackBar(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackbar'];
    config.duration = 3000;
    this._snackBar.open(message, 'close', config);
  }
  
  isUserAuthenticated() {
    const token: string = localStorage.getItem("jwt");
    if (token) { return true; }
    else { return false; }
  }


}
