export default () => {
  if (!window.Proxy) {
    throw new Error('Proxy is not availiable')
  }
}
