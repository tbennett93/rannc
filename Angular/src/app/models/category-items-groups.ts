import { CategoryItemsModel } from "./category-items.model";
import { ICategoryItemsGroups } from "./Icategory-items-groups";

export class CategoryItemsGroups implements ICategoryItemsGroups{
    key: string;
    values: CategoryItemsModel[];
}
