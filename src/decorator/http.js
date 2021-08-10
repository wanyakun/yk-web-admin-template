export function handleHttp() {
  return function(target, name, descriptor) {
    const originFun = descriptor.value
    descriptor.value = async function(...args) {
      return new Promise(async(resolve, reject) => {
        try {
          const data = await originFun.apply(this, args).catch(e => {
            const result = e.response.result
            if (result === -3000) {
              // 需要刷新token或者重新登录，逻辑待补充
            }
          })
          const result = data.result
          if (result === -3000) {
            // 需要刷新token或者重新登录,逻辑待补充
          } else {
            resolve(data)
          }
        } catch (e) {
          reject(e)
        }
      })
    }
    return descriptor
  }
}
