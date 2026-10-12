import { defineType, defineField } from 'sanity'

export const mapMarker = defineType({
  name: 'mapMarker',
  title: 'Marcador 3D del Mapa',
  type: 'object',
  fields: [
    defineField({
      name: 'businessType',
      title: 'Tipo de Negocio',
      type: 'string',
      options: {
        list: [
          { title: '🐟 Restaurante', value: 'restaurant' },
          { title: '🏨 Hotel', value: 'hotel' },
          { title: '💊 Farmacia', value: 'pharmacy' },
          { title: '🪩 Discoteca / Bar', value: 'nightclub' },
          { title: '🛒 Otro', value: 'other' },
        ]
      },
    }),
    defineField({
      name: 'model3d',
      title: 'Modelo 3D (GLB)',
      type: 'file',
      options: { accept: '.glb,.gltf' }
    }),
    defineField({
      name: 'icon2d',
      title: 'Ícono 2D - Fallback',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'scale',
      title: 'Tamaño en mapa',
      type: 'number',
      initialValue: 1.5
    }),
    defineField({
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
    }),
  ]
})