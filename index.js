const core = require('@actions/core')
const github = require('@actions/github')
const https = require('https')

const processString = (string, limit) => {
  // truncate string if it's longer than the limit
  if (string.length > limit) {
    string = string.substring(0, limit) + "...";
  }

  // Slack API does not support horizontal ellipsis (…), so we need to remove them
  string = string.replace(/…/g, "...");

  return string;
};

const main = async () => {
  const slackToken = core.getInput('slack_token')
  const channelId = core.getInput('channel_id')
  const projectName = core.getInput('project_name')
  const githubToken = core.getInput('github_token')
  const inputOwnerName = core.getInput('repo_owner_name')
  const inputRepoName = core.getInput('repo_name')
  const releaseTagInput = core.getInput('release_tag').trim()

  // Get owner and repo from context of payload that triggered the action
  const { owner, repo } = github.context.repo

  const resolvedOwner = inputOwnerName || owner
  const resolvedRepo = inputRepoName || repo

  // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
  const octokit = github.getOctokit(githubToken)

  const { data: release } = releaseTagInput
    ? await octokit.rest.repos.getReleaseByTag({
        owner: resolvedOwner,
        repo: resolvedRepo,
        tag: releaseTagInput,
      })
    : await octokit.rest.repos.getLatestRelease({
        owner: resolvedOwner,
        repo: resolvedRepo,
      })

  const releaseTag = release.tag_name
  const releaseName = release.name
  const releaseBody = processString(release.body, 500)
  const releaseAuthor = release.author

  // Get the changelog URL
  const changelogUrl = `https://github.com/${resolvedOwner}/${resolvedRepo}/releases/tag/${releaseTag}`

  core.info(`changelogUrl: ${changelogUrl}`)
  
  const payload = JSON.stringify({
    channel: channelId,
    token: slackToken,
    attachments: [
      {
        pretext : `New version of ${projectName}: *${releaseTag}* has been released!`,
        text : `
*Release name*: ${releaseName}
*Release body*: ${releaseBody}
*Changelog*: ${changelogUrl}
${releaseAuthor?.login ? `*Release author*: ${releaseAuthor?.login}` : ''}
        `,
      },
    ],
  })

  core.info(`payload: ${payload}`)
  
  const requestOptions = {
    method: 'POST',
    port: 443,
    hostname: 'slack.com',
    path: '/api/chat.postMessage',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': payload.length,
      Authorization: `Bearer ${slackToken}`,
      Accept: 'application/json',
    },
  }

  const messageRequest = https.request(requestOptions, res => {
    let responseData = ''
    res.on('data', (d) => {
      responseData += d
    })
    res.on('end', () => {
      if (res.statusCode === 200) {
        const jsonResponse = JSON.parse(responseData)
        if (jsonResponse.ok === true) {
          core.setOutput('status', '✅ Message sent!')
          return
        }
      }
      core.setFailed(`❌ Failed request: ${responseData}`)
    })
  })

  messageRequest.on('error', () => {
    core.setFailed('Failed to fetch Slack')
  })

  messageRequest.write(payload)
  messageRequest.end()
}

main()
