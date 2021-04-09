import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { CategoryItemsModel } from 'src/app/models/category-items.model';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CategoryItem } from 'src/app/models/category-item';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';


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
  categoryItemsGroups: any;
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
        next: (data: CategoryItem[]) => {
          console.log(data);

          // this.categoryGroups = this.getCategoryGroups(data);

          // console.log('Category groups');
          // console.log(this.categoryGroups);
          
          data.sort((a,b) => a.group > b.group ? 1 : a.group < b.group ? -1 : 0 ||  a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
          // this.categoryItemsGroups = this.groupBy(data, 'group'); 
          this.categoryItemsGroups = this.groupByArray(data, 'group'); 
          // console.log(this.groupBy(data, 'group'));
          // console.log(this.categoryItemsGroups);
          // this.categoryItemsGroups.forEach(element => {
          //   this.categoryItemsGroupTypes.push(element.group)
          // });
        },
        error: () => console.log("error fetching category items")
      });
    }
    // o.orange; // => [{"type":"orange","title":"First"},{"type":"orange","title":"Second"}]
    // o.banana; // => [{"type":"banana","title":"Third"},{"type":"banana","title":"Fourth"}]
    // console.log(this.arr)
    // console.log(o)
    // console.log(o.orange)

    // let o = this.groupBy(this.categoryItems, 'group'); // => {orange:[...], banana:[...]}
    // o.orange; // => [{"type":"orange","title":"First"},{"type":"orange","title":"Second"}]
    // o.banana; // => [{"type":"banana","title":"Third"},{"type":"banana","title":"Fourth"}]
    // console.log(this.arr)
    // console.log(o)
    // console.log(o.orange)
    // console.log(o.orange)    
  }
  // getCategoryGroups(data: CategoryItem[]): CategoryGroup[] {
  //   var categoryGroups: CategoryGroup[] = new Array<CategoryGroup>();
  //   // console.log(data);
  //   data.forEach(element => {
  //     let currElement: CategoryGroup = new CategoryGroup();
  //     currElement.name = element.group;
  //     currElement.categoryModelId = element.categoryModelId;
  //     if (!categoryGroups.some(item => item.name === currElement.name && item.categoryModelId === currElement.categoryModelId)) {
  //       categoryGroups.push(currElement);

  //     }
  //   });
  //   // console.log('getCategoryGroups:');
  //   // console.log(categoryGroups);
  //   return categoryGroups;
  // };

  //groups an array by 'property' and creates a new object for each group
  //reduce takes a callback with two properties
    //memo=accumulator (the accumulates callback return values)
    //x = current value of the array
  //this checks whether an array of type property has been created
    //if not, it creates one
    //if so, it pushes the current value to it

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



  // todo = [
  //   'Get to work',
  //   'Pick up groceries',
  //   'Go home',
  //   'Fall asleep'
  // ];

  // done = [
  //   'Get up',
  //   'Brush teeth',
  //   'Take a shower',
  //   'Check e-mail',
  //   'Walk dog'
  // ];

  onClick(event, item){
    console.log('clicked ' + item);
  }


  saveState(){
  }

  deleteItem(categoryIndex, itemIndex){
    let categoryItem =  this.categoryItemsGroups[categoryIndex]['values'][itemIndex];
    
    this.data.deleteCategoryItem(categoryItem.id).subscribe({
      next: data => {
        this.categoryItemsGroups[categoryIndex]['values'].splice(itemIndex,1)
        console.log('delete Item. Deleted:');
        // console.log(this.categoryItemsGroups[categoryIndex]['values'][itemIndex]);      
      },
      error: err => console.log(err)
    });

    
  }
  mouseEnterItem(item){
    console.log(item)  ;
  }

  addNew(inputBox, groupName, categoryIndex){
    if(!inputBox.value){
      
      return null;
    }
    if (this.tokenService.isAccessTokenValid){
      let categoryItem = new CategoryItemsModel;
      categoryItem.name = inputBox.value;
      categoryItem.group = groupName;
      // categoryItem.order = list['values'].length + 1;
      categoryItem.order = (this.categoryItemsGroups[categoryIndex]['values'].length + 1).toString();
      categoryItem.comment = "comment not implenmented";
      categoryItem.categoryModelId = this.categoryId;
      inputBox.value = '';
      // console.log('list');
      // console.log(list);
      // console.log('list length');
      // console.log(list['values'].length);
      // console.log('array #- ');
      // console.log(categoryIndex);
      // console.log(this.categoryItemsGroups[categoryIndex]['values']);
      console.log(categoryItem);
      // this.categoryItemsGroups[categoryIndex]['values'].push(categoryItem);
      
      //MAke post request and update UI after successful post
      this.data.postCategoryItems(categoryItem).subscribe(
        
        (data: any) =>  {
          // console.log('pushing data:');
          // console.log(data); 
          // console.log('to:');
          // console.log(this.categoryItemsGroups[categoryIndex]['values']);
          this.categoryItemsGroups[categoryIndex]['values'].push(data);

        },
        // (data: any) => console.log(data),
        (error: any) => console.log(error)
      );
      console.log(this.categoryItemsGroups[categoryIndex]['values']);
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
// export class CategoryGroup {
//   name: string;
//   categoryModelId: number;
// };