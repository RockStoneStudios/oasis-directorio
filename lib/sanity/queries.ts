import { defineQuery } from "next-sanity";

// ============================================
// FRAGMENTOS REUTILIZABLES
// ============================================

const imageFragment = /* groq */ `
  asset->{
    _id,
    url,
    metadata { lqip, dimensions }
  },
  alt
`;

const addressFragment = /* groq */ `
  street,
  neighborhood,
  state,
  directionDetails
`;

// ============================================
// BÚSQUEDAS DE NEGOCIOS (BUSINESS)
// ============================================

export const FEATURED_BUSINESSES_QUERY = defineQuery(/* groq */ `
  *[_type == "business" && isFeatured == true] | order(createdAt desc)[0...6] {
    _id,
    _type,
    name,
    "slug": slug,
    "logo": logo { ${imageFragment} },
    description,
    status,
    rating,
    address { ${addressFragment} },
    municipality->{ _id, name, "slug": slug },
    category->{ _id, name, "slug": slug, icon },
    isFeatured,
    createdAt
  }
`);

export const BUSINESS_SEARCH_QUERY = defineQuery(/* groq */ `
  *[_type == "business" 
    && ($category == "" || category->slug.current == $category)
    && (
      count($subcategories) == 0 ||
      count(subcategories[@->slug.current in $subcategories]) > 0
    )
    && ($municipality == "" || municipality->slug.current == $municipality)
    && ($status == "" || status == $status)
    && ($minRating == 0 || rating >= $minRating)
    && (!$hasWhatsapp || defined(whatsapp) && whatsapp != "")
    && (!$hasAddress || defined(address.street) && address.street != "")
    && ($search == "" || name match $search + "*" || description match $search + "*")
  ] | order(
    select($sort == "name_asc" => lower(name), "") asc,
    select($sort == "name_desc" => lower(name), "") desc,
    select($sort == "rating_desc" => rating, 0) desc,
    select($sort == "rating_asc" => rating, 0) asc,
    createdAt desc
  ) [$start...$end] {
    _id,
    _type,
    name,
    "slug": slug,
    "logo": logo { ${imageFragment} },
    description,
    status,
    whatsapp,
    phone,
    rating,
    address { ${addressFragment} },
    location,
    municipality->{ _id, name, "slug": slug },
    category->{ _id, name, "slug": slug, icon },
    subcategories[]->{ _id, name, "slug": slug },
    isFeatured,
    createdAt
  }
`);

export const BUSINESS_DETAIL_QUERY = defineQuery(/* groq */ `
  *[_type == "business" && (slug.current == $slug || _id == $id)][0] {
    _id,
    _type,
    name,
    "slug": slug,
    "logo": logo { ${imageFragment} },
    "gallery": gallery[] { ${imageFragment} },
    description,
    status,
    hours,
    whatsapp,
    phone,
    facebook,
    instagram,
    website,
    address { ${addressFragment} },
    location,
    municipality->{ _id, name, "slug": slug },
    category->{ _id, name, "slug": slug, icon },
    subcategories[]->{ _id, name, "slug": slug },
    rating,
    isFeatured,
    createdAt
  }
`);

// ============================================
// LISTAS PARA SELECTORES (SIDEBAR)
// ============================================

export const CATEGORIES_LIST_QUERY = defineQuery(/* groq */ `
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug,
    icon,
    "subcategories": *[_type == "subcategory" && parentCategory._ref == ^._id] | order(name asc) {
      _id,
      name,
      "slug": slug
    }
  }
`);

export const MUNICIPALITIES_LIST_QUERY = defineQuery(/* groq */ `
  *[_type == "municipality"] | order(name asc) {
    _id,
    name,
    "slug": slug
  }
`);

// ============================================
// OTROS COMPONENTES (EVENTOS, NOTICIAS, ETC)
// ============================================

export const UPCOMING_EVENTS_QUERY = defineQuery(/* groq */ `
  *[_type == "event" && dateTime(date) >= dateTime(now())] | order(date asc) {
    _id,
    title,
    "slug": slug,
    date,
    venueName,
    "image": image { ${imageFragment} },
    municipality->{ name }
  }
`);

export const RECENT_NEWS_QUERY = defineQuery(/* groq */ `
  *[_type == "news"] | order(publishedAt desc)[0...4] {
    _id,
    title,
    "slug": slug,
    publishedAt,
    "image": image { ${imageFragment} },
    category->{ name }
  }
`);
