const User = require('../models/User');

const firebaseAuthHandler = async (req, res) => {
  const { uid, email, displayName, photoURL, provider } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ error: 'Missing required user data' });
  }

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({ uid, email, displayName, photoURL, provider });
    }

    return res.status(200).json({ message: 'User authenticated', user });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { firebaseAuthHandler };
