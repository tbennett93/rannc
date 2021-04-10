export interface CategoryGroups {
    id: number;
    name: string;
    order: number;
    items: Item[];
}


export interface Item {
    id: string;
    name: string;
    order: string;
    comment: string;
}



