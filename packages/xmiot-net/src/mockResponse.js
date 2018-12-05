export const cancelResponse = _response => {
  return {
    config: {
      ..._response
    },
    statusText: 'cancel',
    data: null
  }
}
