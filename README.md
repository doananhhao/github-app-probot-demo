## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build bundle
npm build

# 2. Build container
docker build -t probot-ilaam .

# 3. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> probot-ilaam
OR
docker compose up
```
