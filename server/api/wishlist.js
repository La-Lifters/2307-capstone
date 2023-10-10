const express = require('express');
const router = express.Router();

router.post('/wishlist', async (req, res, next) => {
  try {
    const { userId, productId } = req.body;
    // Add item to wishlist in DB
    res.status(201).send(/* new wishlist item */);
  } catch (err) {
    next(err);
  }
});

router.delete('/wishlist/:wishlistId', async (req, res, next) => {
  try {
    const { wishlistId } = req.params;
    // Remove item from wishlist in DB
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/users/:userId/wishlist', async (req, res, next) => {
  try {
    const { userId } = req.params;
    // Fetch wishlist items from DB
    res.status(200).send(/* wishlist items */);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
