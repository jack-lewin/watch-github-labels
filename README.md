# Watch GitHub Labels

Watch GitHub repos for new issues with specific labels.

## Setup

1. **Clone this repo**

    `git clone https://github.com/jack-lewin/watch-github-labels.git`

    `cd watch-github-labels`


2. **Edit `watching.json` to select the labels you're watching.**

    ```
    [
      {
        "owner": "facebook",
        "repo": "react",
        "labels": [
          "Difficulty: beginner",
          "Type: Bug"
        ]
      },
      {
        "owner": "microsoft",
        "repo": "vscode",
        "labels": [
          "beginner"
        ]
      }
    ]
    ```


3. **Create a new applet on IFTTT.**

    If you don't already have an account, you can join at https://ifttt.com/join.

    Click on [create an applet](https://ifttt.com/create) and enter the following recipe:

    * if 'Webhooks' -> receive a web request -> `NEW_ISSUE`
    * then 'Email' -> send me an email 
    
        (Subject: `value1`, Body: `value2`)


4. **Create a new Heroku app and deploy the application.**

    For instructions on doing this, see '[Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)'.


5. **Define the following config variables:**

    `GITHUB_OAUTH` - to authenticate with the GitHub API (https://github.com/settings/tokens).

    `MAKER_KEY` - to authenticate with your IFTTT applet (https://ifttt.com/services/maker_webhooks/settings).

    `INTERVAL_TIME` - how often you want to check for new issues (mins). Default: 30.


6. **Install and configure the 'Heroku Scheduler' add-on.**

    Run `npm start` at the interval you chose in step 5.


