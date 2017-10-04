const GitHubApi = require('github')
const https = require('https')
const querystring = require('querystring')
const watching = require('./watching.json')
const triggerName = 'NEW_ISSUE'

/**
 * Connects to the GitHub API
 *
 * @param formattedTime - time (formatted for the 'If-Modified-Since' header) that we want to search for issues since
 *
 * @returns a GitHub API object
 */
exports.connect = function (formattedTime) {
  // connect to the GitHub API
  var github = new GitHubApi({
    headers: {
      'User-Agent': 'watch-github-label',
      'If-Modified-Since': formattedTime
    }
  })

  // authenticate with the GitHub API, if possible
  if (typeof process.env.GITHUB_OAUTH !== 'undefined') {
    github.authenticate({
      type: 'oauth',
      token: process.env.GITHUB_OAUTH
    })
  } else {
    console.warn(`Please create a GitHub OAuth token at https://github.com/settings/tokens,
    .. and store it as an environment variable: GITHUB_OAUTH.
    .. The token only needs repo access.`)
  }

  return github
}

/**
 * Gets issues since a given time, from the GitHub API
 *
 * @param time   - time (in milliseconds) that we want to search for issues since
 * @param github - a GitHub API object
 *
 * @returns a Promise which resolves with [ repo: [issues] ]
 */
exports.getIssues = function (time, github) {
  return Promise.all(
    watching.map(item => {
      return github.issues.getForRepo({
        owner: item.owner,
        repo: item.repo,
        labels: item.labels.join(','),
        since: time
      })
    })
  )
}

/**
 * Emails the user about a given issue
 *
 * @param issue - in the format provided by the GitHub API
 */
exports.notify = function (issue) {
  var { owner, repo, title, url, labels } = parseIssue(issue)

  var subject = `New issue in ${owner}/${repo}`
  var content = [title, url, `Labels: ${labels}`].join('<br><br>')

  var query = querystring.stringify({ value1: subject, value2: content })
  var triggerUrl = `https://maker.ifttt.com/trigger/${triggerName}/with/key/${process.env.MAKER_KEY}?${query}`

  https.get(triggerUrl, res => {
    if (res.statusCode !== 200) {
      res.resume() // consume response data to free up memory
      console.error(`IFTTT returned status ${res.statusCode}. ${res.statusMessage}`)
    } else {
      console.log(`Email sent: ${subject} (${url})`)
    }
  })
}

/**
 * Convert an issue from GitHub's API format, to an object containing the info we need
 *
 * @param issue - in the format provided by the GitHub API
 *
 * @returns issue - { owner, repo, title, url, labels }
 */
function parseIssue (issue) {
  var url = issue.html_url
  var title = issue.title
  var labels = issue.labels.map(label => label.name).join('\n')

  var urlArr = url.split('github.com/')[1].split('/')
  var owner = urlArr[0]
  var repo = urlArr[1]

  return { owner, repo, title, url, labels }
}
