export const municipality = {
  name: 'municipality',
  title: 'Municipality',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Nombre del municipio (ej: Sopetrán)',
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
      name: 'flag',
      title: 'Flag Image',
      type: 'image',
      description: 'Imagen de la bandera del municipio',
      options: {
        hotspot: true,
      },
    },
    {
        name: 'description',
        title: 'Description',
        type: 'text',
        description: 'Breve descripción turística o informativa del municipio',
    }
  ],
};