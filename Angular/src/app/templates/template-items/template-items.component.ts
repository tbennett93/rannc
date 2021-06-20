import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryGroupsItems } from 'src/app/models/category-groups';
import { DataService } from 'src/app/services/data.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-template-items',
  templateUrl: './template-items.component.html',
  styleUrls: ['./template-items.component.scss']
})
export class TemplateItemsComponent implements OnInit {


  categoryGroupItems: CategoryGroupsItems;
  getLoaded: boolean = false;

  errorMsg: string = 'Error Processing Request';

  constructor(private tokenService: TokenService, private data: DataService, private route: ActivatedRoute,  private _snackBar: MatSnackBar, private viewportScroller: ViewportScroller, private router: Router) { }

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

        error: (err) => {
          console.log("error fetching category items");
          if (err.status === 403){
            this.openSnackBar('You do not have authorisation to view this data.');
            this.router.navigate(['/home']);
          }else{
            this.openSnackBar('Error getting your data. Please try again later.');
          }
        },
        complete: () => console.log('finished fetch')
      });
    }
    else{
      console.log('NOT LOGGED IN');
    }
  }

  saveTemplate(id: number){
  
  }
  
  

  deleteCategory(): void{
    if (confirm("Are you sure you want to delete this category and all contents?")) {

      if (this.tokenService.isAccessTokenValid()) {
        this.data.deleteCategory(this.categoryId).subscribe({
          next: resp => this.router.navigate(['/my-categories']),
          error: err => {
            console.log(err);
            this.openSnackBar('Error deleting category. Please try again later.');
          }
        })
      }
    };
  }


}
