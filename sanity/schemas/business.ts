// schemas/business.ts

export const business = {
  name: 'business',
  title: 'Business',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Business Name', validation: (Rule: any) => Rule.required() },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'name' } },
    { name: 'logo', type: 'image', title: 'Business Logo' },
    { name: 'gallery', type: 'array', title: 'Gallery Images', of: [{ type: 'image' }] },
    { name: 'description', type: 'text', title: 'Description' },
    {
      name: 'status',
      type: 'string',
      title: 'Current Status',
      options: {
        list: [
          { title: 'Open', value: 'open' },
          { title: 'Closed', value: 'closed' },
          { title: 'Temporarily Closed', value: 'temporarily_closed' },
        ],
      },
    },
    { name: 'hours', type: 'array', title: 'Opening Hours', of: [{ type: 'businessHours' }] },
    
    // Contact
    { name: 'whatsapp', type: 'string', title: 'WhatsApp Number' },
    { name: 'phone', type: 'string', title: 'Phone Number' },
    { name: 'facebook', type: 'url', title: 'Facebook URL' },
    { name: 'instagram', type: 'url', title: 'Instagram URL' },
    { name: 'website', type: 'url', title: 'Website URL' },

    // Location
    { name: 'municipality', type: 'reference', title: 'Municipality', to: [{ type: 'municipality' }] },
    { name: 'address', type: 'address', title: 'Full Address' },
    { name: 'location', type: 'geopoint', title: 'Map Location' },

    // Classification
    { name: 'category', type: 'reference', title: 'Main Category', to: [{ type: 'category' }] },
    { 
      name: 'subcategories', 
      type: 'array', 
      title: 'Subcategories', 
      of: [{ type: 'reference', to: [{ type: 'subcategory' }] }] 
    },

    // Metadata
    { name: 'rating', type: 'number', title: 'Rating', validation: (Rule: any) => Rule.min(0).max(5) },
    { name: 'isFeatured', type: 'boolean', title: 'Is Featured Business?', initialValue: false },

    { 
      name: 'createdAt', 
      type: 'datetime', 
      title: 'Fecha de Registro',
      initialValue: () => new Date().toISOString(),
    },
  ],
};