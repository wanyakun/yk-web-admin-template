import axios from '../network'
import { handleHttp } from '../decorator'

class Request {
  @handleHttp()
  async post(url, parms, config = {}) {
    const data = await axios.post(url, { ...parms }, config).catch(e => {
      throw e
    })
    if (data.response) {
      return data.response.resultContent
    } else {
      return data
    }
  }
}

export default new Request()
