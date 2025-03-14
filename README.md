# Chat Summary Bot

Chat Summary Bot is a Discord bot that summarizes the last N hours of messages in a specified channel. It uses OpenAI's GPT-4 model to generate the summaries.

## Features

- Summarizes the last N hours of messages in a specified channel.
- Caches summaries to avoid redundant API calls.
- Limits the usage of the summary command to once every two hours per user.
- Deletes old summaries from the database to keep it clean.

## Prerequisites

- Node.js (version 16.11.0 or higher)
- A Discord bot token
- An OpenAI API key

## Installation

Clone the repository:

```bash
git clone https://github.com/good-gartic/chat-summary.git
cd chat-summary
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the root directory and add your environment variables:

```env
DISCORD_TOKEN=your-discord-bot-token
OPENAI_API_KEY=your-openai-api-key
SUMMARY_CHANNEL_ID=your-summary-channel-id
CLIENT_ID=your-discord-client-id
GUILD_ID=your-discord-guild-id
```

## Usage

Compile the TypeScript code:

```bash
npm run build
```

Register the slash commands:

```bash
node deploy-commands.js
```

Start the bot:

```bash
npm start
```

## Project Structure

.
├── dist/                       # Compiled JavaScript files
├── node_modules/               # Node.js modules
├── src/                        # Source files
│   ├── scripts/                # Scripts folder
│   │   └── deploy-commands.ts  # Command deployment script
│   ├── config.ts               # Configuration file
│   ├── databaseService.ts      # Database service
│   ├── discordBot.ts           # Discord bot implementation
│   ├── index.ts                # Entry point
│   └── summaryService.ts       # Summary service
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── .prettierrc                 # Prettier configuration
├── package.json                # NPM package configuration
├── package-lock.json           # NPM package lock file
└── tsconfig.json               # TypeScript configuration

## Configuration

The configuration is managed through environment variables defined in the `.env` file:

- `DISCORD_TOKEN`: Your Discord bot token.
- `OPENAI_API_KEY`: Your OpenAI API key.
- `SUMMARY_CHANNEL_ID`: The ID of the channel where the summary command can be used.
- `CLIENT_ID`: Your Discord client ID.
- `GUILD_ID`: Your Discord guild ID.

## Commands

- `/summary [hours]`: Get a summary of the last N hours of messages. The hours parameter is optional and defaults to 1 if not provided.

## License

This project is licensed under the MIT License.