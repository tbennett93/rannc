import { Component, OnInit, Input } from '@angular/core';
import { CategoryGroupDto, CategoryGroupsItems, CategoryGroupsItemsDto, Group, Item } from 'src/app/models/category-groups';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { TokenService } from 'src/app/services/token.service';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewportScroller } from '@angular/common';
import { CategoryItemsModel } from 'src/app/models/category-items.model';


@Component({
  selector: 'app-drag-drop-card-list',
  templateUrl: './drag-drop-card-list.component.html',
  styleUrls: ['./drag-drop-card-list.component.scss']
})
export class DragDropCardListComponent implements OnInit {

  @Input() categoryGroupItems: CategoryGroupsItems;

  @Input() categoryId;

  getLoaded: boolean = false;

  
  constructor( private _snackBar: MatSnackBar, private tokenService: TokenService, private data: DataService, private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {
    this.viewportScroller.setHistoryScrollRestoration("manual");

  }

  
  deleteItem(groupIndex, itemIndex, itemId) {
    if (this.tokenService.isAccessTokenValid) {
      this.data.deleteCategoryItem(itemId).subscribe({
        next: data => {
          this.categoryGroupItems.groups[groupIndex]['items'].splice(itemIndex, 1)
        },
        error: err => {
          console.log(err);
          this.openSnackBar('Error deleting item. Please try again later.');
        }
      });
    }
    console.log('itemIndex');
    console.log(itemIndex);
  }

  deleteGroup(groupId, groupIndex) {
    let categoryGroupDto = this.getCategoryGroupFromGroupIndex(groupIndex);

    
    if (this.tokenService.isAccessTokenValid) {
      console.log('DEleting:');
      console.log(categoryGroupDto);
      if (confirm("Are you sure you want to delete this group and all contents?")) {
        this.data.deleteCategoryGroup(categoryGroupDto).subscribe({
          next: resp => this.categoryGroupItems.groups.splice(groupIndex, 1),
          error: err => {
            console.log(err);
            this.openSnackBar('Error deleting group. Please try again later.');
          }
        })
      }
    }
  }

  getCategoryGroupFromGroupIndex(groupIndex): CategoryGroupDto{
    let categoryGroupDto = new CategoryGroupDto;
    categoryGroupDto.categoryId = this.categoryGroupItems.categoryId;
    categoryGroupDto.id =  this.categoryGroupItems.groups[groupIndex].id; 
    categoryGroupDto.name =  this.categoryGroupItems.groups[groupIndex].name; 
    categoryGroupDto.order =  this.categoryGroupItems.groups[groupIndex].order; 
    return categoryGroupDto;
  }  

  getCategoryGroupFromContainer(containerId): CategoryGroupDto{
    let categoryGroupDto = new CategoryGroupDto;
    let movedGroup = this.categoryGroupItems.groups.find(m=> m.id == containerId);
    console.log('containerId');
    console.log(containerId);
    console.log('movedGroup');
    console.log(movedGroup);
    categoryGroupDto.categoryId = this.categoryGroupItems.categoryId;
    categoryGroupDto.id = movedGroup.id;
    categoryGroupDto.name = movedGroup.name;
    categoryGroupDto.order = movedGroup.order;
    return categoryGroupDto;
  }
  


  addNewGroup(input) {
    if (!input.value) {
      this.openSnackBar('Enter a group name');
      return;
    }

    if (this.tokenService.isAccessTokenValid) {

      let categoryGroup = new CategoryGroupDto;
      categoryGroup.categoryId = this.categoryGroupItems.categoryId;
      categoryGroup.name = input.value;
      categoryGroup.order = (this.categoryGroupItems.groups.length + 1).toString();

      this.data.postCategoryGroup(categoryGroup).subscribe({
        next: (data: any) => {
          // console.log(data);
          let newGroup = new Group;
          newGroup.name = data.name;
          newGroup.order = data.order;
          newGroup.id = data.id.toString();
          newGroup.items = new Array<Item>();
          this.categoryGroupItems.groups.push(newGroup);
          this.scrollRight();
          
          // console.log('categoryGroup:');
          // console.log(categoryGroup);
        }
        ,
        error: err => {
          console.log(err);
          this.openSnackBar('Error adding new group. Please try again later.');
        }
      });
      input.value = '';
    }
  }


  scrollRight(){
    setTimeout(() => {
      this.viewportScroller.scrollToPosition([9999999999999,0]);
    }, 0);
 
  }
  
  addNew(inputBox, groupId, categoryIndex) {
    if (!inputBox.value) {
      this.openSnackBar('Enter an item name');
      return null;
    }

    if (this.tokenService.isAccessTokenValid) {
      let categoryItem = new CategoryItemsModel;
      categoryItem.name = inputBox.value;
      categoryItem.groupId = groupId.toString();
      // categoryItem.order = list['values'].length + 1;
      if (!this.categoryGroupItems.groups[categoryIndex]['items']) {
        categoryItem.order = '1';
      }
      else {
        categoryItem.order = (this.categoryGroupItems.groups[categoryIndex]['items'].length + 1).toString();
      }
      categoryItem.comment = "comment not implemented";
      categoryItem.categoryModelId = this.categoryId;
      inputBox.value = '';


      //MAke post request and update UI after successful post
      console.log('categoryItem to post:');
      console.log(categoryItem);
      this.data.postCategoryItems(categoryItem).subscribe(

        (data: any) => {
          this.categoryGroupItems.groups[categoryIndex]['items'].push(data);
        },
        // (data: any) => console.log(data),
        (error: any) => {
          console.log(error);
          this.openSnackBar('Error adding new item. Please try again later.');
        }
      );
      console.log(this.categoryGroupItems.groups[categoryIndex]['items']);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    let categoryGroupSave: Group[] = JSON.parse(JSON.stringify(this.categoryGroupItems.groups));
    let categoryGroupItemsDto = new Array<CategoryGroupsItemsDto>();

    if (event.previousContainer === event.container) {
      if(event.previousIndex === event.currentIndex){
        return;
      }
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateItemOrder();


      let categoryGroupItems: CategoryGroupsItemsDto = this.categoryGroupItems.groups
      .map(ite=>({...ite,categoryId:this.categoryGroupItems.categoryId}))
      .find(m=> m.id == event.container.id);

      console.log('pushed:');
      console.log(categoryGroupItems);

      categoryGroupItemsDto.push(categoryGroupItems); //adds the categoryId. Takes the whole groups object and spits out that plus the categoryId


      // console.log('categoryGroupChanges');
      // console.log(categoryGroupChanges);
      this.data.moveItem(categoryGroupItemsDto).subscribe({
        next: data => {
          console.log('Db order update successful');
        },
        error: err=> {
          console.log(err);
          this.categoryGroupItems.groups = categoryGroupSave;
          this.updateGroupOrder();
          this.updateItemOrder();
          this.openSnackBar('Error moving item. Please try again later.');

  
        }
      });      
      // this.data.moveItem()
    } else {
      console.log(event);
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.updateItemOrder();

      categoryGroupItemsDto.push(this.categoryGroupItems.groups
        .map(ite=>({...ite,categoryId:this.categoryGroupItems.categoryId}))
        .find(m=> m.id == event.container.id)); //adds the categoryId. Takes the whole groups object and spits out that plus the categoryId
  
      categoryGroupItemsDto.push(this.categoryGroupItems.groups
        .map(ite=>({...ite,categoryId:this.categoryGroupItems.categoryId}))
        .find(m=> m.id == event.previousContainer.id)); //adds the categoryId. Takes the whole groups object and spits out that plus the categoryId

      this.data.moveItem(categoryGroupItemsDto).subscribe({
        next: data => {
          console.log('Db order update successful');
        },
        error: err=> {
          console.log(err);
          this.categoryGroupItems.groups = categoryGroupSave;
          this.updateGroupOrder();
          this.updateItemOrder();
          this.openSnackBar('Error moving item. Please try again later.');
  
        }
      });   

    }
  }

  
  //Each array list is assigned an id of that group's id via the HTML
  //[cdkDropListConnectedTo] allows you to specify which other lists belong to the same list group
  //setting that attribute to return the list of IDs in the overall group allows movement of items between groups
  getConnectedList(): any[] {
    let val = this.categoryGroupItems.groups.map(x => x.id);
    return val;
  }


  //this is taken from the dropItem() function above and allows the movement of groups
  dropGroup(event: CdkDragDrop<string[]>) {
    if(event.previousIndex === event.currentIndex){
      return;
    }
    // console.log('categoryGroups');
    // console.log(this.categoryGroups);
    let categoryGroupSave: Group[] = JSON.parse(JSON.stringify(this.categoryGroupItems.groups));
    console.log('categoryGroupSave');
    console.log(categoryGroupSave);
    moveItemInArray(this.categoryGroupItems.groups, event.previousIndex, event.currentIndex);
    this.updateGroupOrder();

    // let categoryGroupDto = new Array<CategoryGroupDto>();
    let categoryGroupDto = this.categoryGroupItems.groups
      .map(({items,...rest})=> rest)//eliminates the items array. Takes an object with keys items and the remainder and outputs only the remainder
      .map(ite=>({...ite,categoryId:this.categoryGroupItems.categoryId})); //adds the categoryId. Takes the whole groups object and spits out that plus the categoryId

    this.data.moveGroup(categoryGroupDto).subscribe({
      next: data => {
        console.log('Db order update successful');
      },
      error: err=> {
        console.log(err);
        this.categoryGroupItems.groups = categoryGroupSave;
        this.updateGroupOrder();
        this.openSnackBar('Error moving group. Please try again later.');
      }
    });
    
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'close', {
      duration: 3000
    });

  }

  updateGroupOrder(){
    console.log('updating group order');
    let i = 0;

    this.categoryGroupItems.groups.forEach(
      x => {
        x.order = (i+1).toString();
        i++;
      }
    );
  }


  updateItemOrder(){
    console.log('updating item order');
    let i = 0;

    this.categoryGroupItems.groups.forEach(
      x => {
        let j = 0;
        x.items.forEach(
          y=> {
            y.order = (j+1).toString();
            j++;
          }
          
        )

      }
    );
  }

}
