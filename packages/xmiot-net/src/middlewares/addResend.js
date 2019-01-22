import { publicAxios } from '../adapters'

export default net => {
  net
    .postSuccess(response => {
      const { config } = response
      config.resend = () => publicAxios(config)
      return response
    })
    .postError(err => {
      const { config } = err
      config.resend = () => publicAxios(config)
      return err
    })
}
