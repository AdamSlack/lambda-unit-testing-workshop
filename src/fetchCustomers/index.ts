import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import middy from '@middy/core'
import jsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import validator from '@middy/validator'
import axios from 'axios'
import logger from '../logger'

import inputSchema from './schema'

type QueryParams = {
  limit: string,
  pageNumber: string
}

const fetchCustomers = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const queryParams = event.queryStringParameters as QueryParams;
  const limit = queryParams.limit || '5'
  const pageNumber = queryParams.pageNumber || '1' 
  
  logger('DEBUG','invoked with query params', queryParams)
  
  const params = { limit, pageNumber }
  
  const baseUrl = process.env.baseUrl;
  const url = `${baseUrl}/customers`

  const customer = await axios.get(url, { params })

  return {
    statusCode: 200,
    body: JSON.stringify(customer)
  }
}

const handler = middy(fetchCustomers)
  .use(jsonBodyParser()) 
  .use(httpErrorHandler())
  .use(validator({ inputSchema }))

export {
  handler
}