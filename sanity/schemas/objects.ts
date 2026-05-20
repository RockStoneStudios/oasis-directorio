// schemas/objects.ts

export const address = {
  name: 'address',
  title: 'Address',
  type: 'object',
  fields: [
    { name: 'street', type: 'string', title: 'Street/Road' },
    { name: 'neighborhood', type: 'string', title: 'Neighborhood/Vereda' },
    { name: 'state', type: 'string', title: 'State', initialValue: 'Antioquia' },
    { name: 'directionDetails', type: 'text', title: 'Direction Details (Reference points)' },
  ],
};


export const businessHours = {
  name: 'businessHours',
  title: 'Business Hours',
  type: 'object',
  fields: [
    // 🌟 NUEVO: Switch global para decidir si quieres texto corrido completo o por días
    {
      name: 'useGlobalCustomText',
      type: 'boolean',
      title: '¿Usar un único texto resumido para todo el horario?',
      description: 'Activa esto para escribir líneas como "Lun-Vier 7am - 5pm" en un solo campo.',
      initialValue: false,
    },
    {
      name: 'globalCustomText',
      type: 'string',
      title: 'Horario Resumido Completo',
      description: 'Ej: Lun-Sab 8am - 8pm , Dom 9am - 5pm',
      hidden: ({ parent }: any) => !parent?.useGlobalCustomText,
    },

    // --- ESTRUCTURA POR DÍAS (Se muestra solo si useGlobalCustomText es falso) ---
    {
      name: 'day',
      type: 'string',
      title: 'Day',
      options: {
        list: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ],
      },
      hidden: ({ parent }: any) => parent?.useGlobalCustomText,
    },
    { 
      name: 'open', 
      type: 'string', 
      title: 'Opening Time (e.g. 08:00)',
      hidden: ({ parent }: any) => parent?.useGlobalCustomText,
    },
    { 
      name: 'close', 
      type: 'string', 
      title: 'Closing Time (e.g. 22:00)',
      hidden: ({ parent }: any) => parent?.useGlobalCustomText,
    },
    { 
      name: 'isClosed', 
      type: 'boolean', 
      title: 'Is it closed all day?', 
      initialValue: false,
      hidden: ({ parent }: any) => parent?.useGlobalCustomText,
    },
    { 
      name: 'isOpen', 
      type: 'boolean', 
      title: 'Is it Open all day?', 
      initialValue: false,
      hidden: ({ parent }: any) => parent?.useGlobalCustomText,
    },
    { 
      name: 'customText', 
      type: 'string', 
      title: 'Texto Personalizado para ESTE día (Opcional)', 
      hidden: ({ parent }: any) => parent?.useGlobalCustomText,
    },
  ],
};