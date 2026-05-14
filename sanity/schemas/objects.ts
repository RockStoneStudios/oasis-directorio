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
    {
      name: 'day',
      type: 'string',
      title: 'Day',
      options: {
        list: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ],
      },
    },
    { name: 'open', type: 'string', title: 'Opening Time (e.g. 08:00)' },
    { name: 'close', type: 'string', title: 'Closing Time (e.g. 22:00)' },
    { name: 'isClosed', type: 'boolean', title: 'Is it closed all day?', initialValue: false },
     { name: 'isOpen', type: 'boolean', title: 'Is it Open all day?', initialValue: false },
  ],
};