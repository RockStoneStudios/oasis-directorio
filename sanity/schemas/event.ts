export const event = {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Event Poster / Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'venueName',
      title: 'Venue Name',
      type: 'string',
      description: 'Ej: Parque Principal, Hostería Los Colorados, etc.',
    },
    {
      name: 'date',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
      description: 'Déjalo vacío si el evento dura solo un día.',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Escribe "0" o "Gratis" para eventos sin costo.',
      initialValue: '0',
    },
    {
      name: 'municipality',
      title: 'Municipality',
      type: 'reference',
      to: [{ type: 'municipality' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'address',
      title: 'Exact Address',
      type: 'address',
    },
  ],
};