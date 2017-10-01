const { timeMinsAgo, formatTime } = require('./helpers.js')
const { connect, getIssues, notify } = require('./app.js')

// defaults to 30 mins
var interval = process.env.INTERVAL_TIME || 30
var time = timeMinsAgo(interval)
var formattedTime = formatTime(time)

// check for maker key
if (!process.env.MAKER_KEY) {
  var err = `Please find your maker key at
    .. https://ifttt.com/services/maker_webhooks/settings, and
    .. store it as an environment variable: MAKER_KEY.`

  throw new Error(`Could not connect to IFTTT. ${err}`)
}

// connect to the GitHub API
const github = connect(formattedTime)

// check for issues; notify if successful
getIssues(time, github)
  .then(repoArr => {
    repoArr.forEach(issues => {
      issues.data.forEach(issue => notify(issue))
    })
  })
