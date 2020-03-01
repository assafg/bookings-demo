const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const { v1 } = require('uuid');
const cors = require('cors');

const router = express.Router();

const MONGODB_URI = 'mongodb://mongo:27017';

const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
});

let db;
let listings;

const conn = async (req, res, next) => {
    if (!listings) {
        await client.connect();
        db = await client.db('bookings');
        listings = await db.collection('listings');
    }
    next();
};

router.use(cors());
router.use(conn);
const LISTINGS_PER_PAGE = 10;
/* GET listing. */
router.get('/', [
    async (req, res, next) => {
        const { page } = req.query;
        const results = await listings
            .find({})
            .skip(page * LISTINGS_PER_PAGE)
            .limit(LISTINGS_PER_PAGE)
            .toArray();
        res.send(results);
    },
]);

router.get('/:id', conn, async (req, res) => {
    const { id } = req.params;
    const listing = await listings.findOne({ _id: id });
    if (!listing) {
        return res.sendStatus(404);
    }
    res.send(listing);
});

router.post('/', async (req, res) => {
    const { body } = req;
    // TODO Validate body
    try {
        const data = { _id: v1(), ...body };
        console.log('data', data);

        await listings.insertOne(data);
        res.status(201).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await listings.remove({ _id: id });
    res.send();
});

module.exports = router;
