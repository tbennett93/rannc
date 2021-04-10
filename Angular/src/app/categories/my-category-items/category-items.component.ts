import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CategoryItemsModel } from 'src/app/models/category-items.model';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CategoryItem } from 'src/app/models/category-item';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { CategoryItemsGroups } from 'src/app/models/category-items-groups';
import { CategoryGroups, Item } from 'src/app/models/category-groups';


@Component({
  templateUrl: './category-items.component.html',
  styleUrls: ['./category-items.component.css']
})


export class CategoryItemsComponent implements OnInit {

  // arr = [
  //   {type:"orange", title:"First"},
  //   {type:"orange", title:"Second"},
  //   {type:"banana", title:"Third"},
  //   {type:"banana", title:"Fourth"}
  // ];

  // categoryItems: CategoryItemsModel[];
  categoryItemsGroups: CategoryItemsGroups[];
  categoryGroups: CategoryGroups[];
  // categoryGroups: CategoryGroup[];
  // testArray = [
  //   {type:"test genre 1", values:[{name:"superbad"}, {name:"40YOV"}]},
  //   {type:"test genre 2", values:[{name:"heredetary"}, {name:"babadook"}]}
  //   ];


  constructor(private data: DataService, private route: ActivatedRoute, private tokenService: TokenService) { }

  categoryId;
  ngOnInit(): void {
    // console.log(this.testArray);
    this.categoryId = this.route.snapshot.params['id'];
    if (this.tokenService.isAccessTokenValid){
      this.data.getCategoryItems(this.categoryId).subscribe({
        next: (data: CategoryGroups[]) => {
          data.sort(((a,b):any => parseInt(a.order) - parseInt(b.order)));
          console.log(data);
          this.categoryGroups = data;
          console.log('category groups:');
          console.log(this.categoryGroups);

        },
        error: () => console.log("error fetching category items")
      });
    }

  }
 

  groupByArray(xs, key) {
    return xs.reduce(function (rv, x) {
      let v = key instanceof Function ? key(x) : x[key];
      let el = rv.find((r) => r && r.key === v);
      if (el) { el.values.push(x); }
      else { rv.push({ key: v, values: [x] }); } return rv;
    }, []);
  }

  groupBy(arr, property) {
    return arr.reduce(function(memo, x) {
      if (!memo[x[property]]) { memo[x[property]] = []; }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }



  onClick(event, item){
    // console.log('clicked ' + item);
  }


  saveState(){
  }

  deleteItem(groupIndex, itemIndex, itemId){
    console.log('delete item called:');
    console.log('groupId' + groupIndex);
    console.log('itemId' + itemId);
    console.log(this.categoryGroups[groupIndex]['items']['id']);

    this.data.deleteCategoryItem(itemId).subscribe({
      next: data => {
        console.log(this.categoryGroups[groupIndex]['items']);
        this.categoryGroups[groupIndex]['items'].splice(itemIndex,1)

        console.log('delete Item. Deleted:');
        // console.log(this.categoryItemsGroups[categoryIndex]['values'][itemIndex]);      
      },
      error: err => console.log(err)
    });

    
  }

  deleteGroup(index){
    console.log('Deleted group index:');
    console.log(index);

    let categoryGroup =  this.categoryItemsGroups[index];
    console.log('Deleted group:');
    console.log(categoryGroup);

  }

  onCategoryClick(event, key, list){
   
  }
  mouseEnterItem(item){
    console.log(item)  ;
  }

  addNewGroup(input){
    if(!input.value){
      return;
    }
    
    console.log(input);
    console.log(this.categoryItemsGroups);
    let categoryGroup = new CategoryGroups;
    categoryGroup.name = input.value;
    categoryGroup.categoryId = this.categoryGroups[0].categoryId;
    categoryGroup.order = (this.categoryGroups.length + 1).toString();
    let categoryItemsModel = new Array<Item>();
    categoryGroup.items = categoryItemsModel;
    
    this.data.postCategoryGroup(categoryGroup).subscribe({
      next: (data: any) => {
        console.log(data);
        categoryGroup.id = data.id;
        this.categoryGroups.push(categoryGroup)}
        ,
      error: err=> console.log(err)
    });
    
    input.value= '';

  }

  addNew(inputBox, groupId, categoryIndex){
    if(!inputBox.value){
      
      return null;
    }
    if (this.tokenService.isAccessTokenValid){
      let categoryItem = new CategoryItemsModel;
      categoryItem.name = inputBox.value;
      categoryItem.groupId = groupId.toString();
      // categoryItem.order = list['values'].length + 1;
      if(!this.categoryGroups[categoryIndex]['items']){
        categoryItem.order = '1';
      }
      else{
        categoryItem.order = (this.categoryGroups[categoryIndex]['items'].length + 1).toString();
      }
      categoryItem.comment = "comment not implenmented";
      categoryItem.categoryModelId = this.categoryId;
      inputBox.value = '';
     
      
      //MAke post request and update UI after successful post
      console.log('categoryItem to post:');
      console.log(categoryItem);
      this.data.postCategoryItems(categoryItem).subscribe(
        
        (data: any) =>  {
         
          this.categoryGroups[categoryIndex]['items'].push(data);

        },
        // (data: any) => console.log(data),
        (error: any) => console.log(error)
      );
      console.log(this.categoryGroups[categoryIndex]['items']);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
  }

}
