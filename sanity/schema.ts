import type { SchemaTypeDefinition } from "sanity";
import {business} from './schemas/business';
import {category} from './schemas/category';
import {subcategory} from './schemas/subcategory';
import {newsCategory} from './schemas/newsCategory';
import {event} from './schemas/event';
import {municipality} from './schemas/municipality';
import {atm} from './schemas/atm';
import {news} from './schemas/news';
import {businessHours,address} from './schemas/objects'



export const schema: { types: SchemaTypeDefinition[] } = {
  types: [business,category,subcategory,newsCategory,news,event,municipality,atm,businessHours,address],
};
