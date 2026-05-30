// schemas/business.ts

import { title } from "process";
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
          { title: 'Always Open', value: 'alwaysopen' }
        ],
      },
    },
    { name: 'hours', type: 'array', title: 'Opening Hours', of: [{ type: 'businessHours' }] },
    
    // Contact
    { name: 'whatsapp', type: 'string', title: 'WhatsApp Number' },
    { name: 'phone', type: 'string', title: 'Phone Number' },
    { name: 'facebook', type: 'url', title: 'Facebook URL' },
    { name: 'instagram', type: 'url', title: 'Instagram URL' },
    { name: 'tiktok', type: 'url', title: 'TikTok URL' },
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

    // 👇 SECCIÓN DE AMENITIES PARA EL TURISTA 👇
    {
      name: 'amenities',
      title: 'Comodidades para el Turista',
      description: 'Selecciona las características y servicios clave que ofrece este negocio al visitante.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'grid',
        list: [
          { title: '🐾 Pet Friendly', value: 'pet_friendly' },
          { title: '❄️ Aire Acondicionado / Ventilador', value: 'air_conditioning' },
          { title: '📶 Wi-Fi Gratis', value: 'free_wifi' },
          { title: '💻 Espacio de Trabajo (Coworking)', value: 'coworking' },
          { title: '🔌 Tomacorrientes Accesibles', value: 'power_outlets' },
          { title: '🚗 Parqueadero Privado / Propio', value: 'private_parking' },
          { title: '🏊‍♂️ Acceso a Piscina / Pasadía', value: 'pool_access' },
          { title: '💧 Tanque / Reserva', value: 'water_backup' },
        ],
      },
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