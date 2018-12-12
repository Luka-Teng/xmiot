export const cancelResponse = _response => {
  return {
    config: {
      ..._response
    },
    response: {
      statusText: 'cancel',
      data: null
    }
  }
}
