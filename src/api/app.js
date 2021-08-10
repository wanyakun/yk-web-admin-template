import request from '@/network/request'
import { exception } from '../decorator'

class AppApi {
  @exception({ needMessage: true })
  async appOfCurrentUser(params) {
    const data = await request.post('/app/currentAuthor', params)
    return data
  }

  @exception({ needMessage: true, needLoading: true })
  async appDetail(params) {
    const data = await request.post('/app/detail', params)
    return data
  }
}

export default new AppApi()
