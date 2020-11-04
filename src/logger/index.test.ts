import logger from './index'

const mockLog = jest.spyOn(console, 'log').mockImplementation()

beforeEach(() => {
  jest.clearAllMocks()
})

describe('when invoked with debug level and no message', () => {
  beforeEach(() => {
    logger('DEBUG')
  })

  it('should console log a DEBUG', () => {
    expect(mockLog).toHaveBeenCalledWith('DEBUG')
  })
})

describe('when invoked with debug level and a message', () => {
  beforeEach(() => {
    logger('DEBUG', 'test-message')
  })

  it('should console log a DEBUG', () => {
    expect(mockLog).toHaveBeenCalledWith('DEBUG', 'test-message')
  })
})

describe('when invoked with error level no message', () => {
  beforeEach(() => {
    logger('ERROR')
  })

  it('should console log a DEBUG', () => {
    expect(mockLog).toHaveBeenCalledWith('ERROR')
  })
})

describe('when invoked with error level and a message', () => {
  beforeEach(() => {
    logger('ERROR', 'test-message')
  })

  it('should console log a DEBUG', () => {
    expect(mockLog).toHaveBeenCalledWith('ERROR', 'test-message')
  })
})