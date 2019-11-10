const { Rental } = require('../models/rental')
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

router.post('/', auth, async (req, res) => {
    if (!req.body.customerId) return res.status(400).send('No customerId in req body.')

    if (!req.body.movieId) return res.status(400).send('No movieId in req body.')
    
    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movieId._id': req.body.movieId
    })  

    if (rental.dateReturned) return res.status(400).send('Return already processed')

    rental.dateReturned = new Date();
    await rental.save();
    return res.status(200).send()
});

module.exports = router;