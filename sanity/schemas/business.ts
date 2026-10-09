// schemas/business.ts

export const business = {
  name: 'business',
  title: 'Negocio',
  type: 'document',
  groups: [
    { name: 'main', title: 'Información', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    { name: 'name', type: 'string', title: 'Nombre del negocio', group: 'main', validation: (Rule: any) => Rule.required() },
    { name: 'slug', type: 'slug', title: 'Slug (URL)', group: 'main', options: { source: 'name' } },
    { name: 'logo', type: 'image', title: 'Logo del negocio', group: 'main' },
    { name: 'gallery', type: 'array', title: 'Galería de imágenes', group: 'main', of: [{ type: 'image' }] },
    { name: 'description', type: 'text', title: 'Descripción', group: 'main' },

    // 👇 SEO 👇
    {
      name: 'seoTitle',
      type: 'string',
      title: 'Título SEO',
      group: 'seo',
      description: 'Máximo 60 caracteres. Ej: El Caserón – Hamburguesas y Chuzos en Sopetrán',
      validation: (Rule: any) =>
        Rule.max(60).warning('Google corta el título a unos 60 caracteres'),
    },
    {
      name: 'seoDescription',
      type: 'text',
      title: 'Descripción SEO',
      group: 'seo',
      rows: 3,
      description:
        'Entre 120 y 155 caracteres. Diga qué venden, dónde están y un dato diferenciador (domicilios, parqueadero, horario). Es el texto que se ve en Google.',
      validation: (Rule: any) =>
        Rule.min(120).max(155).warning('Lo ideal es entre 120 y 155 caracteres'),
    },

    {
      name: 'status',
      type: 'string',
      title: 'Estado actual',
      group: 'main',
      options: {
        list: [
          { title: 'Abierto', value: 'open' },
          { title: 'Cerrado', value: 'closed' },
          { title: 'Cerrado temporalmente', value: 'temporarily_closed' },
          { title: 'Abierto 24 horas', value: 'alwaysopen' },
        ],
      },
    },
    { name: 'hours', type: 'array', title: 'Horarios de atención', group: 'main', of: [{ type: 'businessHours' }] },

    // Contacto
    { name: 'whatsapp', type: 'string', title: 'Número de WhatsApp', group: 'main' },
    { name: 'phone', type: 'string', title: 'Teléfono', group: 'main' },
    { name: 'facebook', type: 'url', title: 'URL de Facebook', group: 'main' },
    { name: 'instagram', type: 'url', title: 'URL de Instagram', group: 'main' },
    { name: 'tiktok', type: 'url', title: 'URL de TikTok', group: 'main' },
    { name: 'website', type: 'url', title: 'Sitio web', group: 'main' },

    // Ubicación
    { name: 'municipality', type: 'reference', title: 'Municipio', group: 'main', to: [{ type: 'municipality' }] },
    { name: 'address', type: 'address', title: 'Dirección completa', group: 'main' },
    { name: 'location', type: 'geopoint', title: 'Ubicación en el mapa', group: 'main' },

    // Clasificación
    { name: 'category', type: 'reference', title: 'Categoría principal', group: 'main', to: [{ type: 'category' }] },
    {
      name: 'subcategories',
      type: 'array',
      title: 'Subcategorías',
      group: 'main',
      of: [{ type: 'reference', to: [{ type: 'subcategory' }] }],
    },

    // 👇 COMODIDADES PARA EL TURISTA 👇
    {
      name: 'amenities',
      title: 'Comodidades para el turista',
      group: 'main',
      description: 'Seleccione las características y servicios clave que ofrece este negocio al visitante.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'grid',
        list: [
          { title: '🐾 Pet Friendly', value: 'pet_friendly' },
          { title: '❄️ Aire acondicionado / Ventilador', value: 'air_conditioning' },
          { title: '📶 Wi-Fi gratis', value: 'free_wifi' },
          { title: '💻 Espacio de trabajo (Coworking)', value: 'coworking' },
          { title: '🔌 Tomacorrientes accesibles', value: 'power_outlets' },
          { title: '🚗 Parqueadero privado / propio', value: 'private_parking' },
          { title: '🏊‍♂️ Acceso a piscina / Pasadía', value: 'pool_access' },
          { title: '💧 Tanque / Reserva de agua', value: 'water_backup' },
        ],
      },
    },

    // Metadatos
    { name: 'rating', type: 'number', title: 'Calificación', group: 'main', validation: (Rule: any) => Rule.min(0).max(5) },
    { name: 'isFeatured', type: 'boolean', title: '¿Negocio destacado?', group: 'main', initialValue: false },

    {
      name: 'createdAt',
      type: 'datetime',
      title: 'Fecha de registro',
      group: 'main',
      initialValue: () => new Date().toISOString(),
    },
  ],
};