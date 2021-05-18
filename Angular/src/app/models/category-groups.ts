export class CategoryGroupsItemsDto {
    id: string;
    name: string;
    order: string;
    categoryId:string;
    items: Item[];

}

export class CategoryGroupsItems {
    categoryId: string;
    categoryName: string;
    groups: Group[];
}

export class Group {
    id: string;
    name: string;
    order: string;
    items: Item[];
}


export class Item {
    id: string;
    name: string;
    order: string;
    comment: string;
}


export class CategoryGroupDto {
    categoryId:string;
    id: string;
    name: string;
    order: string;
}


