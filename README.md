# A General Purpose Discord Bot 

## Overview

This Discord bot is built using Discord.js and comes with some features I found useful at the time.

## Features

### 1. Top Reacted Message

The `/showtopreactions` command fetchs and display the message with the highest count of any single reaction in the current channel. Limited implementation so far due to rate limits of discord API, requires cleanup.

### 2. Channel Replacement

With the `/postArchivedEmbed` command, messages from the current channel can be posted in another channel for the purpose of preserving channel content before deletion. It uses the  into a readable and shareable format. It uses [DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter) to create a archived copy of channel in json format, which it uses to post archived messages. 
TODO: Integrate DiscordChatExporter neatly and automate the process even further.


## Getting Started

To get started with the DiscordBot, follow these steps:

1. Clone the repository to your local machine.
   ```bash
   git clone https://github.com/OkabeKiyouma/DiscordBot.git
   ```

2. Install the required dependencies.
   ```bash
   npm install
   ```

3. Set up your Discord bot on the [Discord Developer Portal](https://discord.com/developers/applications) and obtain your bot token.

4. Create a `config.json` file in the project root and add your Discord bot token.
   ```json
   {
        "token": your-bot-token,
        "clientId": your-client-id,
        "guildIds" : array-of-server-ids,
        "MALClientId": your-mal-client-id
    }
   ```

5. Deploy slash commands (During initial setup or slash commands are modified, added or removed.)
    ```bash
    node deploy-commands.js
    ```

6. Run the bot.
   ```bash
   node index.js
   ```

## Contributing

Feel free to contribute to the development of this Discord bot! You can submit bug reports, suggest new features, or even create pull requests.


## Acknowledgments

Special thanks to the developers of Discord.js and DiscordChatExporter for their excellent libraries that made this bot possible.