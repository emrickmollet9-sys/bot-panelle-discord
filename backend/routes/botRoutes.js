const express = require('express');
const auth = require('../middleware/auth');
const Bot = require('../models/Bot');
const Command = require('../models/Command');
const { startBot, stopBot, updateBotPresence } = require('../services/botManager');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  try {
    const bots = await Bot.find().sort({ createdAt: -1 });
    res.json(bots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des bots.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, token, prefix, status, activity, activityType } = req.body;
    const bot = new Bot({ name, token, prefix, status, activity, activityType });
    await bot.save();
    res.status(201).json(bot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de créer le bot.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);
    if (!bot) return res.status(404).json({ error: 'Bot introuvable.' });

    Object.assign(bot, req.body);
    await bot.save();
    res.json(bot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de mettre à jour le bot.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await stopBot(req.params.id);
    await Bot.findByIdAndDelete(req.params.id);
    await Command.deleteMany({ bot: req.params.id });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de supprimer le bot.' });
  }
});

router.post('/:id/start', async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);
    if (!bot) return res.status(404).json({ error: 'Bot introuvable.' });
    const startedBot = await startBot(bot);
    res.json(startedBot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Impossible de démarrer le bot.' });
  }
});

router.post('/:id/stop', async (req, res) => {
  try {
    const bot = await stopBot(req.params.id);
    if (!bot) return res.status(404).json({ error: 'Bot introuvable.' });
    res.json(bot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible d’arrêter le bot.' });
  }
});

router.post('/:id/presence', async (req, res) => {
  try {
    const { status, activity, activityType } = req.body;
    const bot = await updateBotPresence(req.params.id, { status, activity, activityType });
    res.json(bot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de mettre à jour la présence.' });
  }
});

router.get('/:id/commands', async (req, res) => {
  try {
    const commands = await Command.find({ bot: req.params.id });
    res.json(commands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de récupérer les commandes.' });
  }
});

router.post('/:id/commands', async (req, res) => {
  try {
    const { trigger, response, description } = req.body;
    const command = new Command({ bot: req.params.id, trigger, response, description });
    await command.save();
    res.status(201).json(command);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de créer la commande.' });
  }
});

router.put('/:id/commands/:commandId', async (req, res) => {
  try {
    const command = await Command.findOneAndUpdate(
      { _id: req.params.commandId, bot: req.params.id },
      req.body,
      { new: true }
    );
    if (!command) return res.status(404).json({ error: 'Commande introuvable.' });
    res.json(command);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de modifier la commande.' });
  }
});

router.delete('/:id/commands/:commandId', async (req, res) => {
  try {
    const command = await Command.findOneAndDelete({ _id: req.params.commandId, bot: req.params.id });
    if (!command) return res.status(404).json({ error: 'Commande introuvable.' });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de supprimer la commande.' });
  }
});

module.exports = router;
