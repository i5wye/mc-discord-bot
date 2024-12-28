// Import Discord.js and Minecraft Server Util
const { Client, GatewayIntentBits } = require('discord.js');
const { status } = require('minecraft-server-util');

// Create a new Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Your bot token
const TOKEN = 'your-bot-token';

// When the bot is ready
client.once('ready', () => {
  console.log(`Minecraft Bot is online as ${client.user.tag}!`);
});

// Command handler
client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Command: Help
  if (message.content === '!help') {
    message.reply(
      `**🛠️ Minecraft Bot Commands:**\n\n` +
      `1. **!help** - Displays this help message.\n` +
      `2. **!mcserver <server_address> [port]** - Checks the status of a Minecraft server.\n` +
      `   Example: \`!mcserver play.hypixel.net\`\n` +
      `3. **!mcplayer <username>** - Fetches information about a Minecraft player (UUID and skin).\n` +
      `   Example: \`!mcplayer Notch\`\n\n` +
      `Enjoy the bot! 🎮`
    );
  }

  // Command: Check Minecraft Server Status
  if (message.content.startsWith('!mcserver')) {
    // Example: !mcserver play.hypixel.net
    const args = message.content.split(' ');
    if (args.length < 2) {
      message.reply('Please provide a Minecraft server address. Example: `!mcserver play.hypixel.net`');
      return;
    }

    const serverAddress = args[1];
    const port = args[2] ? parseInt(args[2]) : 25565; // Default port is 25565

    try {
      const response = await status(serverAddress, port);
      message.reply(
        `🎮 **Minecraft Server Status**:\n` +
        `- Server: \`${serverAddress}\`\n` +
        `- Version: ${response.version.name}\n` +
        `- Players: ${response.players.online}/${response.players.max}\n` +
        `- MOTD: ${response.motd.clean}`
      );
    } catch (error) {
      message.reply(`❌ Could not fetch server status. Is the server address correct?`);
    }
  }

  // Command: Get Minecraft Player Info
  if (message.content.startsWith('!mcplayer')) {
    // Example: !mcplayer Notch
    const args = message.content.split(' ');
    if (args.length < 2) {
      message.reply('Please provide a Minecraft username. Example: `!mcplayer Notch`');
      return;
    }

    const username = args[1];
    const uuidURL = `https://api.mojang.com/users/profiles/minecraft/${username}`;

    try {
      const response = await fetch(uuidURL);
      if (!response.ok) {
        throw new Error('Player not found');
      }

      const data = await response.json();
      message.reply(
        `🎮 **Minecraft Player Info**:\n` +
        `- Username: ${data.name}\n` +
        `- UUID: ${data.id}\n` +
        `- Skin: [View Skin](https://crafatar.com/renders/body/${data.id})`
      );
    } catch (error) {
      message.reply(`❌ Could not fetch player info. Is the username correct?`);
    }
  }
});

// Login to Discord
client.login(TOKEN);