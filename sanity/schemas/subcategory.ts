export const subcategory = {
  name: 'subcategory',
  title: 'Subcategory',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Subcategory Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'parentCategory',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }], // Crea la relación hacia la categoría principal
      validation: (Rule: any) => Rule.required(),
    },
  ],
};