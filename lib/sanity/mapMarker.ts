// sanity/mapMarker.ts - ESTE ES EL QUE TE SIRVE PARA TODO
export const mapMarker = {
  name: 'mapMarker',
  title: 'Marcador 3D del Mapa',
  type: 'object',
  fields: [
    {
      name: 'businessType',
      title: 'Tipo de Negocio',
      type: 'string',
      options: {
        list: [
          { title: '🐟 Restaurante - Ricuras', value: 'restaurant' },
          { title: '🏨 Hotel', value: 'hotel' },
          { title: '💊 Farmacia / Drogería', value: 'pharmacy' },
          { title: '🪩 Discoteca / Bar', value: 'nightclub' },
          { title: '🛒 Otro', value: 'other' },
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'model3d',
      title: 'Modelo 3D (GLB) - Solo Desktop',
      type: 'file',
      description: 'Sube el .glb. Si no subes nada, usa el ícono 2D',
      options: { accept: '.glb' }
    },
    {
      name: 'icon2d',
      title: 'Ícono 2D (Fallback Móvil y Listado)',
      type: 'image',
      options: { hotspot: true },
      description: 'Este es el que se ve en móvil y es OBLIGATORIO',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'scale',
      title: 'Tamaño en mapa',
      type: 'number',
      initialValue: 1,
      options: { list: [0.8, 1, 1.5, 2, 2.5] }
    },
    {
      name: 'animation',
      title: 'Animación',
      type: 'string',
      initialValue: 'float',
      options: {
        list: [
          { title: 'Flotar suave', value: 'float' },
          { title: 'Rotar 360°', value: 'rotate' },
          { title: 'Rebotar', value: 'bounce' },
          { title: 'Quieto', value: 'static' },
        ]
      }
    }
  ],
  preview: {
    select: {
      type: 'businessType',
      media: 'icon2d'
    },
    prepare({ type, media }: any) {
      return { title: `Marcador: ${type}`, media }
    }
  }
}