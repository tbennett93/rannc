export interface Value {
    id: string;
    name: string;
    group: string;
    order: string;
    comment: string;
    categoryModelId: string;
}

export interface ICategoryItemsGroups {
    key: string;
    values: Value[];
}

