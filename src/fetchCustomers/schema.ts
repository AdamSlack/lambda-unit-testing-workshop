export default {
  type: 'object',
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        limit: { type: 'integer', maximum: 10, minimum: 1 },
        pageNumber: { type: 'integer', minimum:  1},
      },
    }
  }
}