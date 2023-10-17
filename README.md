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
        uses: brainfish-ai/slack-notify-release-action
        with:
          slack_token: ${{ secrets.SLACK_TOKEN }}
          channel_id: C03AA0A0A3A
          project_name: Slack notification action
```

Result:

<img width="555" alt="image" src="https://user-images.githubusercontent.com/537363/218570780-bb78a8aa-d2dc-43f9-9c3a-161160b9f073.png">

## Build the action

Install dependencies

```sh
npm i
```

Build the action

```sh
npm run build
```