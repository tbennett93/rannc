import { CategoryItem } from "./category-item";

export class CategoryItemsModel implements CategoryItem {
  id: string;
  name: string;
  group: string;
  order: string;
  comment: string;  
  categoryModelId: string;
}
