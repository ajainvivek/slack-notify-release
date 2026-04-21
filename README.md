# Slack notify release GitHub action

A simple GitHub action to post a Slack message when a new version is released.

## Inputs

The following inputs briefly explained here are fully declared and documented in [action.yml](action.yml):

- `github_token` [**Required**] - GitHub token
- `slack_token` [**Required**] - Slack token
- `channel_id` [**Required**] - Channel ID where to post (shown in 'channel details', e.g. 'C03AA0A0A3A')
- `project_name` [**Required**] - Project name to display
- `repo_owner_name` [**Optional**] - Repository owner name
- `repo_name` [**Optional**] - Repository name
- `release_tag` [**Optional**] - Git tag of the GitHub release to announce (for example `v1.2.0`). When omitted, the [latest release](https://docs.github.com/en/rest/releases/releases#get-the-latest-release) for the repository is used.

## Examples

Run this action on new tag push or new release!

```yml
on:
  push:
    tags:
      - "v1*"
jobs:
  examplejob:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          ref: main
      - name: Notify new release on Slack
        uses: brainfish-ai/slack-notify-release
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          slack_token: ${{ secrets.SLACK_TOKEN }}
          channel_id: C03AA0A0A3A
          project_name: My Project
```

To announce a specific release instead of the latest one, set `release_tag` (it must match an existing release’s tag name):

```yml
      - name: Notify new release on Slack
        uses: brainfish-ai/slack-notify-release
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          slack_token: ${{ secrets.SLACK_TOKEN }}
          channel_id: C03AA0A0A3A
          project_name: My Project
          release_tag: ${{ github.ref_name }}
```

On a workflow triggered by `push` tags, `github.ref_name` is the tag that was pushed (for example `v1.0.0`).

## Build the action

Install dependencies

```sh
npm i
```

Build the action

```sh
npm run build
```
