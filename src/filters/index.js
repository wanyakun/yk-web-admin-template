// 全局filter定义在这里
import Vue from 'vue'
import FLOAT from './float'

/**
 * 将金额格式化 e.g. 1111111 => 1,111,111, 1111111.11 => 1,111,111.11
 */
Vue.filter('separateAmount', amount => {
  if (amount === null || amount === undefined) {
    return '0'
  }
  const iAmount = String(amount).split('.')[0]
  const dAmount = String(amount).split('.')[1]
  const reversedAmount = iAmount.split('').reverse()
  const computedArr = []
  for (let i = 0; i < reversedAmount.length; i++) {
    computedArr.unshift(reversedAmount[i])
    if (i % 3 === 2 && i !== reversedAmount.length - 1) {
      computedArr.unshift(',')
    }
  }
  return computedArr.join('') + (dAmount ? ('.' + dAmount) : '')
})

Vue.filter('turnToInteger', (val) => {
  return val && Math.round(val)
})

/**
 * digits 保留小数的小数位数
 * 转百分数 e.g. 0.123 => 12.3
 */
Vue.filter('transformPercent', (val, digits) => {
  return val && parseFloat(val) ? FLOAT.multiply(val, 100).toFixed(digits) : 0
})
/**
 * digits 保留小数的小数位数
 * 转千分数 e.g. 0.001 => 1
 */
Vue.filter('transformThousand', (val, digits) => {
  return val && parseFloat(val) ? FLOAT.multiply(val, 1000).toFixed(digits) : 0
})

/**
 * digits 保留小数的小数位数
 * 转xx万 e.g. 100000 => 10
 */
Vue.filter('transformMillion', (val, digits) => {
  return val && parseFloat(val) ? FLOAT.divide(val, 10000).toFixed(digits) : 0
})

/**
 * digits 保留小数的小数位数
 * 转xx万 e.g. 1.358 => 1.35
 */
Vue.filter('keepDots', (val, digits) => {
  return val && parseFloat(val) ? FLOAT.multiply(val, 1.00).toFixed(digits) : 0
})

/**
 * 日期格式化
 */
Vue.filter('dateFormat', function(val, format) {
  var deFormat, theDate, month, year, date, hours, mins, seconds
  var formats = {
    LLLL: function() {
      return `${year}年${month}月${date}日  ${hours}:${mins}`
    },
    LLL: function() {
      return `${year}年${month}月${date}日`
    },
    llll: function() {
      return `${year}.${month}.${date}  ${hours}:${mins}`
    },
    lll: function() {
      return `${year}.${month}.${date}`
    },
    LL: function() {
      return `${month}月${date}日`
    },
    mm: function() {
      return `${hours}:${mins}`
    },
    Lll: function() {
      return `${year}-${month}-${date}`
    },
    Llls: function() {
      return `${year}/${month}/${date}`
    },
    Lllss: function() {
      return `${year}/${month}/${date} ${hours}:${mins}:${seconds}`
    },
    Lllmm: function() {
      return `${year}-${month}-${date}  ${hours}:${mins}`
    },
    Lllmmss: function() {
      return `${year}-${month}-${date}  ${hours}:${mins}:${seconds}`
    }
  }
  if (!val && typeof val !== 'number') {
    return ''
  }
  deFormat = format || 'LLL'
  theDate = new Date(val)
  year = theDate.getFullYear()

  function pad(val) {
    var str = '00'
    if (val !== undefined && val !== null) {
      str = val.toString()
      str = str.length < 2 ? `0${str}` : str
    }
    return str
  }

  month = pad(theDate.getMonth() + 1)
  date = pad(theDate.getDate())
  hours = pad(theDate.getHours())
  mins = pad(theDate.getMinutes())
  seconds = pad(theDate.getSeconds())
  return formats[deFormat]()
})

// 处理返回值为空的情况【'' , null】
Vue.filter('dealEmpty', (val, replaceMent = '--', suffix = '', withZero = false) => {
  if (withZero) {
    return (val === '' || val === 0 || val === null || val === undefined) ? replaceMent : val +
      suffix
  } else {
    return (val === '' || val === null || val === undefined) ? replaceMent : val + suffix
  }
})

Vue.filter('limitIn', (val, limitLength = 20, ellipsis = '...', nullReplacer = '***') => {
  if (val === '' || val === null || val === undefined) {
    return nullReplacer
  } else if (val.length > limitLength) {
    return val.substring(0, limitLength - 1) + ellipsis
  }
  return val
})

/**
 * 格式化人数至万单位
 */
Vue.filter('filterAccount', (val) => {
  if (val > 10000) {
    return (val / 10000).toFixed(2) + '万'
  }
  return val + ''
})
