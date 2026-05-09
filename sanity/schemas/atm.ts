export const atm = {
  name: 'atm',
  title: 'Cajeros y Retiros (ATM)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Ej: Cajero Bancolombia - Parque Principal',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'location',
      title: 'Ubicación Geográfica',
      type: 'geopoint',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'address',
      title: 'Dirección',
      type: 'object', // Usamos un objeto para seguir tu interfaz Address
      fields: [
        { name: 'street', title: 'Calle/Carrera', type: 'string' },
        { name: 'neighborhood', title: 'Barrio/Vereda', type: 'string' },
        { name: 'state', title: 'Departamento', type: 'string', initialValue: 'Antioquia' },
        { name: 'directionDetails', title: 'Indicaciones adicionales', type: 'string' },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'recommendation',
      title: 'Recomendación',
      type: 'string',
      description: 'Ej: Suele tener filas largas o solo recibe tarjetas específicas',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'bankName',
      title: 'Nombre del Banco',
      type: 'string',
      options: {
        list: [
          { title: 'Bancolombia', value: 'bancolombia' },
          { title: 'Davivienda', value: 'davivienda' },
          { title: 'Banco de Bogotá', value: 'banco_de_bogota' },
          { title: 'Efecty / Gana', value: 'corresponsal' },
        ],
      },
    },
    {
      name: 'municipality',
      title: 'Municipio',
      type: 'reference',
      to: [{ type: 'municipality' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'is24Hours',
      title: '¿Es 24 Horas?',
      type: 'boolean',
      initialValue: false,
    },
  ],
};