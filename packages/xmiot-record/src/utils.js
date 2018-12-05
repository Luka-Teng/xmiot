export default function throttle (fn, delay, atleast) {
  var timeout = null,
    startTime = new Date()
  return function () {
    var curTime = new Date()
    clearTimeout(timeout)
    if (curTime - startTime >= atleast) {
      fn()
      startTime = curTime
    } else {
      timeout = setTimeout(fn, delay)
    }
  }
}
