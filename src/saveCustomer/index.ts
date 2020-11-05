import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import middy from '@middy/core'
import jsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import validator from '@middy/validator'
import { DocumentClient } from "aws-sdk/clients/dynamodb"

import inputSchema from './schema'
import logger from "../logger"

export type Customer = {
  name: string;
  address: {
    street: string;
    town?: string;
    city: string;
    postCode: string;
  }
}

const saveCustomer = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const customer = event.body as unknown as Customer;
  const TableName = process.env.CUSTOMER_TABLE_NAME;
  
  if(!TableName) {
    logger('DEBUG', 'Customer not saved to dynamo', customer)
    throw new Error('CUSTOMER_TABLE_NAME env var not set')
  }

  const dynamoDB = new DocumentClient()
  await dynamoDB.put({
    TableName,
    Item: { ...customer }
  }).promise()

  logger('DEBUG', 'Customer saved to dynamo', customer)

  return {
    statusCode: 200,
    body: JSON.stringify(customer),
  }
}

const handler = middy(saveCustomer)
  .use(jsonBodyParser()) 
  .use(httpErrorHandler())
  .use(validator({ inputSchema }))

export {
  handler
}