import { Component, ComponentFactoryResolver, OnInit, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CategoryItemsModel } from 'src/app/models/category-items.model';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { CategoryGroups, CategoryGroupDto, Item } from 'src/app/models/category-groups';
import {LayoutModule} from '@angular/cdk/layout';


@Component({
  templateUrl: './category-items.component.html',
  styleUrls: ['./category-items.component.css']
})


export class CategoryItemsComponent implements OnInit {

  categoryGroups: CategoryGroups[];



  constructor(private data: DataService, private route: ActivatedRoute, private tokenService: TokenService) { }

  categoryId;
  ngOnInit(): void {
    // console.log(this.testArray);
    this.categoryId = this.route.snapshot.params['id'];
    if (this.tokenService.isAccessTokenValid) {
      this.data.getCategoryItems(this.categoryId).subscribe({
        next: (data: CategoryGroups[]) => {
          data.sort(((a, b): any => parseInt(a.order) - parseInt(b.order)));
          data.forEach( d => d.items.sort((a,b)=> parseInt(a.order) - parseInt(b.order)));
          data.sort(((a, b): any => parseInt(a.order) - parseInt(b.order)));
          console.log(data);
          this.categoryGroups = data;
          console.log('category groups:');
          console.log(this.categoryGroups);

        },
        error: () => console.log("error fetching category items")
      });
    }
  }

  onClick(event, item) {
    // console.log('clicked ' + item);
  }

  deleteItem(groupIndex, itemIndex, itemId) {
    if (this.tokenService.isAccessTokenValid) {
      this.data.deleteCategoryItem(itemId).subscribe({
        next: data => {
          this.categoryGroups[groupIndex]['items'].splice(itemIndex, 1)
        },
        error: err => console.log(err)
      });
    }
    console.log('itemIndex');
    console.log(itemIndex);
  }

  deleteGroup(groupId, groupIndex) {
    let categoryGroup = this.categoryGroups[groupIndex];
    if (this.tokenService.isAccessTokenValid) {
      console.log('DEleting:');
      console.log(categoryGroup);
      if (confirm("Are you sure you want to delete this group and all contents?")) {
        this.data.deleteCategoryGroup(categoryGroup).subscribe({
          next: resp => this.categoryGroups.splice(groupIndex, 1),
          error: err => console.log(err)
        })
      }
    }
  }


  addNewGroup(input) {
    if (!input.value) {
      return;
    }

    if (this.tokenService.isAccessTokenValid) {

      let categoryGroup = new CategoryGroups;
      categoryGroup.categoryId = this.route.snapshot.params['id'];
      categoryGroup.name = input.value;
      categoryGroup.order = (this.categoryGroups.length + 1).toString();

      this.data.postCategoryGroup(categoryGroup).subscribe({
        next: (data: any) => {
          console.log(data);
          categoryGroup.id = data.id.toString();
          categoryGroup.items = new Array<Item>();
          this.categoryGroups.push(categoryGroup)
          console.log('categoryGroup:');
          console.log(this.categoryGroups);
        }
        ,
        error: err => console.log(err)
      });
      input.value = '';


    }
  }

  addNew(inputBox, groupId, categoryIndex) {
    if (!inputBox.value) {
      return null;
    }

    if (this.tokenService.isAccessTokenValid) {
      let categoryItem = new CategoryItemsModel;
      categoryItem.name = inputBox.value;
      categoryItem.groupId = groupId.toString();
      // categoryItem.order = list['values'].length + 1;
      if (!this.categoryGroups[categoryIndex]['items']) {
        categoryItem.order = '1';
      }
      else {
        categoryItem.order = (this.categoryGroups[categoryIndex]['items'].length + 1).toString();
      }
      categoryItem.comment = "comment not implemented";
      categoryItem.categoryModelId = this.categoryId;
      inputBox.value = '';


      //MAke post request and update UI after successful post
      console.log('categoryItem to post:');
      console.log(categoryItem);
      this.data.postCategoryItems(categoryItem).subscribe(

        (data: any) => {

          this.categoryGroups[categoryIndex]['items'].push(data);

        },
        // (data: any) => console.log(data),
        (error: any) => console.log(error)
      );
      console.log(this.categoryGroups[categoryIndex]['items']);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);


    
    let categoryGroupSave: CategoryGroups[] = JSON.parse(JSON.stringify(this.categoryGroups));
    var categoryGroupChanges = new Array<CategoryGroups>();

    if (event.previousContainer === event.container) {
      if(event.previousIndex === event.currentIndex){
        return;
      }
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateItemOrder();

      categoryGroupChanges.push(this.categoryGroups.find(m=> m.id == event.container.id));
      // console.log('categoryGroupChanges');
      // console.log(categoryGroupChanges);
      this.data.moveItem(categoryGroupChanges).subscribe({
        next: data => {
          console.log('Db order update successful');
        },
        error: err=> {
          console.log(err);
          this.categoryGroups = categoryGroupSave;
          this.updateGroupOrder();
          this.updateItemOrder();
  
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

      categoryGroupChanges.push(this.categoryGroups.find(m=> m.id == event.container.id));
      categoryGroupChanges.push(this.categoryGroups.find(m=> m.id == event.previousContainer.id));

      this.data.moveItem(categoryGroupChanges).subscribe({
        next: data => {
          console.log('Db order update successful');
        },
        error: err=> {
          console.log(err);
          this.categoryGroups = categoryGroupSave;
          this.updateGroupOrder();
          this.updateItemOrder();
  
        }
      });   

    }
  }

  
  //Each array list is assigned an id of that group's id via the HTML
  //[cdkDropListConnectedTo] allows you to specify which other lists belong to the same list group
  //setting that attribute to return the list of IDs in the overall group allows movement of items between groups
  getConnectedList(): any[] {
    let val = this.categoryGroups.map(x => x.id);
    return val;
  }

  //this is taken from the dropItem() function above and allows the movement of groups
  dropGroup(event: CdkDragDrop<string[]>) {
    if(event.previousIndex === event.currentIndex){
      return;
    }
    // console.log('categoryGroups');
    // console.log(this.categoryGroups);
    let categoryGroupSave: CategoryGroups[] = JSON.parse(JSON.stringify(this.categoryGroups));
    // console.log('categoryGroupSave');
    // console.log(categoryGroupSave);
    moveItemInArray(this.categoryGroups, event.previousIndex, event.currentIndex);
    this.updateGroupOrder();

    let categoryGroupDto = this.categoryGroups.map(({items,...rest})=> rest);
    console.log('categoryGroupDto:');
    console.log(categoryGroupDto);

    this.data.moveGroup(categoryGroupDto).subscribe({
      next: data => {
        console.log('Db order update successful');
      },
      error: err=> {
        console.log(err);
        this.categoryGroups = categoryGroupSave;
        this.updateGroupOrder();

      }
    });
    
    // console.log('dropList');
    // console.log(event.container.data);
    // console.log('previousIndex');
    // console.log(event.previousIndex +1);
    // console.log('currentIndexv');
    // console.log(event.currentIndex +1);    
    // console.log('item');
    // console.log(event.item.data.id)
  }

  updateGroupOrder(){
    console.log('updating group order');
    let i = 0;

    this.categoryGroups.forEach(
      x => {
        x.order = (i+1).toString();
        i++;
      }
    );
  }


  updateItemOrder(){
    console.log('updating item order');
    let i = 0;

    this.categoryGroups.forEach(
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

