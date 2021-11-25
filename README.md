## Setup

```sh
# Install dependencies
npm install

# Build bundle
npm run build

# Run the bot
npm start
```

## Docker

```sh
# 1. Build bundle
npm install && npm run build

# 2. Build container
docker build -t probot-ilaam .

# 3. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> probot-ilaam
OR
docker compose up
```

## Environment variables
**Create `.env` file**

**Must have**
```env
APP_ID=
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----##################-----END RSA PRIVATE KEY-----\n"
WEBHOOK_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```
**Dev only**
```env
# Create webhook by smee.io
WEBHOOK_PROXY_URL= 
```

Refer to: https://probot.github.io/docs/configuration/