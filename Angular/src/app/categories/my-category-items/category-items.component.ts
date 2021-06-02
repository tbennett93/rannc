import { Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CategoryItemsModel } from 'src/app/models/category-items.model';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { CategoryGroupsItems, Item, CategoryGroupDto, Group, CategoryGroupsItemsDto } from 'src/app/models/category-groups';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewportScroller } from '@angular/common';


@Component({
  templateUrl: './category-items.component.html',
  styleUrls: ['./category-items.component.scss']
})


export class CategoryItemsComponent implements OnInit {

  categoryGroupItems: CategoryGroupsItems;
  getLoaded: boolean = false;

  errorMsg: string = 'Error Processing Request';

  constructor(private tokenService: TokenService, private data: DataService, private route: ActivatedRoute,  private _snackBar: MatSnackBar, private viewportScroller: ViewportScroller) { }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'close', {
      duration: 3000
    });
  }

  scrollRight(){
    setTimeout(() => {
      this.viewportScroller.scrollToPosition([9999999999999,0]);
    }, 0);
 
  }
  
  categoryId;
  ngOnInit(): void {
    this.categoryId = this.route.snapshot.params['id'];
    console.log('categoryItems this.categoryId');
    console.log(this.categoryId);
    // console.log(this.testArray);
    this.viewportScroller.setHistoryScrollRestoration("manual");
    if (this.tokenService.isAccessTokenValid) {
      this.data.getCategoryItems(this.categoryId).subscribe({
        next: (data: CategoryGroupsItems) => {

          data.groups.sort(((a, b): any => parseInt(a.order) - parseInt(b.order)));
          data.groups.forEach( d => d.items.sort((a,b)=> parseInt(a.order) - parseInt(b.order)));
          data.groups.sort(((a, b): any => parseInt(a.order) - parseInt(b.order)));
          console.log(data);
          this.categoryGroupItems = data;
          console.log('category groups:');
          console.log(this.categoryGroupItems);
          this.getLoaded = true;

        },    

        error: () => {
          console.log("error fetching category items");
          this.openSnackBar('Error getting your data. Please try again later.');
        }
      });
    }
  }



}

