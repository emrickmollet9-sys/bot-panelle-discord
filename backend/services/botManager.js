const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const Bot = require('../models/Bot');
const Command = require('../models/Command');

const activeBots = new Map();

const activityTypeMap = {
  PLAYING: ActivityType.Playing,
  WATCHING: ActivityType.Watching,
  LISTENING: ActivityType.Listening,
  STREAMING: ActivityType.Streaming,
  COMPETING: ActivityType.Competing
};

const buildCommandHandler = async (bot, client) => {
  const commands = await Command.find({ bot: bot._id });
  client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(bot.prefix)) return;

    const input = message.content.slice(bot.prefix.length).trim();
    const command = commands.find((cmd) => cmd.trigger === input);
    if (command) {
      return message.reply(command.response);
    }
  });
};

const refreshPresence = (client, bot) => {
  const activity = bot.activity || 'En ligne';
  const type = activityTypeMap[bot.activityType] || ActivityType.Playing;
  client.user.setPresence({
    status: bot.status || 'online',
    activities: [{ name: activity, type }]
  });
};

const startBot = async (bot) => {
  if (activeBots.has(String(bot._id))) {
    await stopBot(bot._id);
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
  });

  client.once('ready', async () => {
    await refreshPresence(client, bot);
    console.log(`Bot ${bot.name} connecté en tant que ${client.user.tag}`);
  });

  client.on('error', (error) => {
    console.error(`Discord bot ${bot.name} error:`, error);
  });

  await client.login(bot.token);
  await buildCommandHandler(bot, client);

  activeBots.set(String(bot._id), client);
  bot.isRunning = true;
  await bot.save();
  return bot;
};

const stopBot = async (botId) => {
  const client = activeBots.get(String(botId));
  if (client) {
    await client.destroy();
    activeBots.delete(String(botId));
  }
  const bot = await Bot.findById(botId);
  if (bot) {
    bot.isRunning = false;
    await bot.save();
  }
  return bot;
};

const updateBotPresence = async (botId, partial) => {
  const bot = await Bot.findById(botId);
  if (!bot) throw new Error('Bot introuvable');
  Object.assign(bot, partial);
  await bot.save();

  const client = activeBots.get(String(botId));
  if (client && client.user) {
    refreshPresence(client, bot);
  }

  return bot;
};

module.exports = {
  activeBots,
  startBot,
  stopBot,
  updateBotPresence
};
