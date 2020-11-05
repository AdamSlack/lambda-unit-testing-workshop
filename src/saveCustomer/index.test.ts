// suppressing middy error cause lazy
global.console.error = jest.fn(() => {})
import { APIGatewayEventRequestContext, APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context } from 'aws-lambda'
import axios from 'axios'
import DynamoDB from "aws-sdk/clients/dynamodb"
import { Customer, handler } from './index'

jest.mock('../logger')
jest.mock('axios')

const mockDocumentClient = jest.spyOn(DynamoDB, 'DocumentClient')

const mockPutPromise = jest.fn()
const mockPut = jest.fn(() => ({ promise: mockPutPromise }))
mockDocumentClient.mockImplementation(() => ({
  put: mockPut
}) as unknown as DynamoDB.DocumentClient)

const context = {} as Context
const callback = null as unknown as Callback;

let testEvent: APIGatewayProxyEvent 
let mockCustomer: Customer

beforeEach(() => {
  jest.clearAllMocks()
  process.env.CUSTOMER_TABLE_NAME = 'test-table-name'
  testEvent = {
    body: '',
    headers: {
      'Content-Type': 'application/json'
    },
    multiValueHeaders: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '',
    pathParameters: {},
    multiValueQueryStringParameters: {},
    queryStringParameters: {},
    stageVariables: {},
    requestContext: {} as APIGatewayEventRequestContext,
    resource: '',
  }

  mockCustomer = {
    name: 'Test Person',
    address: {
      street: '1 Foo Lane',
      town: 'Bar Town',
      city: 'Foobarton',
      postCode: 'F00 B4R'
    }
  }
})

describe('when invoked with a valid custoemr', () => {
  let handlerResult: APIGatewayProxyResult;

  beforeEach(async () => {
    testEvent.body = JSON.stringify(mockCustomer)
    handlerResult = await handler(testEvent, context, callback) as APIGatewayProxyResult
  });

  it('should return a 200 OK status code', () => {
    expect(handlerResult.statusCode).toEqual(200)
  })

  it('should return the retrieved customers', () => {
    const body = JSON.parse(handlerResult.body)
    expect(body).toEqual(mockCustomer)
  })
})

describe('when DynamoDB Put fails', () => {
  let lambdaError: Error;

  beforeEach(async () => {
    mockPutPromise.mockRejectedValueOnce('fake-error')
    testEvent.body = JSON.stringify(mockCustomer)
    try {
      await handler(testEvent, context, callback) as APIGatewayProxyResult
    } catch(err) {
      lambdaError = err;
    }
  })

  it('should throw an error', () => {
    expect(lambdaError).toEqual('fake-error')
  })
})