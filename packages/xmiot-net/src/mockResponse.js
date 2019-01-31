/**
 * @description mock success response
 * data, status, statusText, headers, config, request
 */
export const mockSuccess = ({
  data,
  status = 200,
  statusText = 'OK',
  headers = {},
  config = {},
  request = {}
} = {}) => {
  return {
    data,
    status,
    statusText,
    headers,
    config,
    request
  }
}

/**
 * @description mock error
 * add statusText attribute to identify cancelled request
 * message, config, code, request, response, statusText
 */
export const mockError = ({
  message,
  config = {},
  code = 400,
  statusText = 'ERROR',
  request = {},
  response = {}
} = {}) => {
  const error = new Error(message)
  error.config = config
  error.code = code
  error.request = request
  error.response = response
  error.statusText = statusText
  return error
}

export const cancelResponse = config => {
  return mockError({
    message: `the request from ${config.url} has been cancelled`,
    config,
    statusText: 'CANCEL'
  })
}
