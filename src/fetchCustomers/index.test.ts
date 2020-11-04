import { APIGatewayEventRequestContext, APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context } from 'aws-lambda'
import { handler } from './index'
import axios from 'axios'

jest.mock('axios')
const mockAxiosGet = jest.spyOn(axios, 'get')

const context = {} as Context
const callback = null as unknown as Callback;

let testEvent: APIGatewayProxyEvent 

beforeEach(() => {
  jest.clearAllMocks()
  process.env.baseUrl = 'https://fake-url.com'
  testEvent = {
    body: '',
    headers: {},
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
})

const queryParamsScenarios: Array<Record<string, string>> = [
  {},
  { limit: '1' },
  { limit: '5' },
  { pageNumber: '1' },
  { pageNumber: '5' },
  { limit: '1', pageNumber: '1' },
  { limit: '5', pageNumber: '5' },
]
describe.each(queryParamsScenarios)('when invoked with query params: %s', (queryParams) => {
  let handlerResult: APIGatewayProxyResult;

  beforeEach(async () => {
    testEvent.queryStringParameters = queryParams
    mockAxiosGet.mockResolvedValueOnce({ results: 'fake-response' })
    handlerResult = await handler(testEvent, context, callback) as APIGatewayProxyResult
  });

  it('should make a http request with correct params', () => {
    const expectedUrl = 'https://fake-url.com/customers'
    const expectedParams = { params: {
      limit: '5',
      pageNumber: '1',
      ...queryParams
    }}
    expect(mockAxiosGet).toHaveBeenCalledWith(expectedUrl, expectedParams)
  })

  it('should return a 200 OK status code', () => {
    expect(handlerResult.statusCode).toEqual(200)
  })

  it('should return the retrieved customers', () => {
    const body = JSON.parse(handlerResult.body)
    expect(body).toEqual({ results: 'fake-response' })
  })
})


const invalidQueryParamsScenarios: Array<Record<string, string>> = [
  { limit: 'a' },
  { limit: '0' },
  { limit: '11' },
  { pageNumber: 'a' },
  { pageNumber: '0' },
  { limit: 'a', pageNumber: 'a' },
  { limit: 'a', pageNumber: 'a' },
]
describe.each(invalidQueryParamsScenarios)('when invoked with query params: %s', (queryParams) => {
  let handlerResult: APIGatewayProxyResult;

  beforeEach(async () => {
    testEvent.queryStringParameters = queryParams
    handlerResult = await handler(testEvent, context, callback) as APIGatewayProxyResult
  });

  it('should not make a http request with correct params', () => {
    expect(mockAxiosGet).not.toHaveBeenCalled()
  })

  it('should return a 400 Bad Request status code', () => {
    expect(handlerResult.statusCode).toEqual(400)
  })

  it('should return validation error message in body', () => {
    expect(handlerResult.body).toEqual('Event object failed validation')
  })
})


describe('when request for customers fails', () => {
  let handlerError: Error;

  beforeEach(async () => {
    mockAxiosGet.mockRejectedValueOnce('fake-error')
    try {
      let foo = await handler(testEvent, context, callback) as APIGatewayProxyResult
    } catch (err) {
      handlerError = err
    }
  });

  it('should make a http request with correct params', () => {
    const expectedUrl = 'https://fake-url.com/customers'
    const expectedParams = { params: { limit: '5', pageNumber: '1' }}
    expect(mockAxiosGet).toHaveBeenCalledWith(expectedUrl, expectedParams)
  })
  
  it('should throw an error', () => {
    expect(handlerError).toEqual('fake-error')
  })
})