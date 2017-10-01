/**
 * @param time - in milliseconds
 *
 * @returns the given time, in the format required for the 'If-Modified-Since' header
 */
exports.formatTime = function (time) {
  time = new Date(time)
  var dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  var day = time.getDay()
  var date = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
  var month = time.getMonth()
  var year = time.getFullYear()
  var hour = time.getHours()
  var min = time.getMinutes()
  var sec = time.getSeconds()

  return `${dayName[day]}, ${date} ${monthName[month]} ${year} ${hour}:${min}:${sec} GMT`
}

/**
 * @returns the time (in milliseconds), X minutes ago
 */
exports.timeMinsAgo = function (mins) {
  var currentTime = new Date().getTime()
  var milliseconds = mins * 60 * 1000

  return currentTime - milliseconds
}
