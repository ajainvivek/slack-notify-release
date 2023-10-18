# Slack notify release GitHub action

A simple GitHub action to post a Slack message when a new version is released.

## Inputs

The following inputs briefly explained here are fully declared and documented in the [action.yaml](action.yaml):

* `slack_token` [**Required**] - Slack token

* `channel_id` [**Required**] - Channel ID where to post (shown in 'channel details', e.g. 'C03AA0A0A3A')

* `project_name` [**Required**] - Project name to display

## Examples

Run this action on new tag push or new release!

```yml
on:
  push:
    tags:
      - 'v1*'
jobs:
  examplejob:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          ref: main
      - name: Notify new release on Slack
        uses: brainfish-ai/slack-notify-release
        with:
          slack_token: ${{ secrets.ORG_SLACK_TOKEN }}
          channel_id: C052E2TRJSJ
          project_name: Slack notification action
```

## Build the action

Install dependencies

```sh
npm i
```

Build the action

```sh
npm run build
```
