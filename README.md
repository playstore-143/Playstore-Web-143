# Appspace Telegram Publisher

This project serves the app-store-style page and includes Vercel API handlers for publishing app pages from a Telegram bot.

## Setup

1. Create a Vercel project and enable a Blob store. Add `BLOB_READ_WRITE_TOKEN` in Vercel environment variables.
2. Create a Telegram bot with BotFather and add `TELEGRAM_BOT_TOKEN` in Vercel environment variables.
3. Add a long random `PUBLISH_SECRET` to Vercel and to the local bot's `.env.local`.
4. Create a Vercel access token and add `VERCEL_TOKEN` to Vercel environment variables. This lets the publisher create one Vercel project per app name.
5. Deploy this project to Vercel and set `PUBLISH_URL=https://YOUR_PROJECT.vercel.app/api/publish` in `.env.local`.
6. Register the Telegram webhook, replacing both values:

```text
https://api.telegram.org/botTELEGRAM_BOT_TOKEN/setWebhook?url=https://YOUR_PROJECT.vercel.app/api/telegram
```

7. Send `/start` to the bot. It asks for the app name, developer name, logo, and any-named APK document, shows progress updates, and replies with:

```text
https://YOUR_PROJECT.vercel.app/app/generated-slug
```

Each app receives its own Vercel project URL based on the app name, for example `Trading App` becomes `https://tradingapp.vercel.app`. The shared publisher URL is used only internally by the bot. If a project name is already taken, a short unique suffix is added.

## Local development

Copy `.env.example` to `.env.local`, fill in the values, then run `npm run dev`.

APK uploads are public download files. Validate and scan customer APKs before publishing them in a production service.