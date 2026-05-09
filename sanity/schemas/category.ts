export const category = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Category Name',
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
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: {
        hotspot: true, // Permite elegir el centro de la imagen
      },
    },
    {
      name: 'icon',
      title: 'Lucide Icon Name',
      type: 'string',
      description: 'Escribe el nombre del icono de Lucide (ej: "utensils", "car", "hotel").',
    },
  ],
};