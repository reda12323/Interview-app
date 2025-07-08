const express = require('express');
const router = express.Router();
const { firebaseAuthHandler } = require('../controllers/firebaseAuthController');
const User = require('../models/User');



router.get('/api/profile-picture/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return photoURL or placeholder
    const photoURL = user.photoURL || 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg';
    
    return res.json({ photoURL });

  } catch (err) {
    console.error('Error fetching user photoURL:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/api/firebaseAuth', firebaseAuthHandler);

module.exports = router;
