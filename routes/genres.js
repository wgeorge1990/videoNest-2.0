const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
router.use(express.json());
const { Genre, validate } = require('../models/genres');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId')

router.get('/', async (req, res ) => {
    // throw new Error('Could not get the genres');// for error testing
    const genres = await Genre.find().sort({name: 1});
    res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send("The genre with this id was not found");

    res.send(genre);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let genre = new Genre({ name: req.body.name });
    await genre.save();
    res.send(genre);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
   const genre = await Genre.findByIdAndUpdate( req.params.id, {name: req.body.name}, {new: true } );
    if (!genre) return res.status(404).send("The genre with the given id was not found");
    res.send(genre);
});

router.delete('/:id', [auth, admin, validateObjectId ], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(400).send("The genre with the given id was not found.");
    res.send(genre);
});

module.exports = router;
