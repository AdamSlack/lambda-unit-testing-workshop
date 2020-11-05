export default {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        address: {
          type: 'object',
          properties: {
            street: { type: 'string', minLength: 3 },
            town: { type: 'string' },
            city: { type: 'string' },
            postcode: { type: 'string' },
          }
        }
      },
    }
  }
}