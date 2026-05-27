const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Veuillez renseigner un nom d’utilisateur et un mot de passe.' });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ error: 'Nom d’utilisateur déjà utilisé.' });
    }

    const user = new User({ username, password });
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Veuillez renseigner un nom d’utilisateur et un mot de passe.' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
